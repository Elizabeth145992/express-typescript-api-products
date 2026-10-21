import type {
  Pool,
  ResultSetHeader,
  PoolConnection,
  RowDataPacket,
} from "mysql2/promise";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { ProductRow } from "../types/product-row.types.js";
import ProductMapper from "../mappers/product.mapper.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";
import type { IOrder } from "../types/order.types.js";
import type { OrderRowComplete } from "../types/order-row-types.js";

interface IStatusOrder extends RowDataPacket {
  id: number;
}

class OrderRepository implements IOrderRepository {
  private pool: Pool;
  private mapper = new ProductMapper();

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async findAll(): Promise<IOrder[] | []> {
    const [results] = await this.pool.execute<OrderRowComplete[]>(
      `SELECT 
        o.id, o.customer_id AS customerId, CONCAT(c.first_name, " ", c.last_name) AS customer,
        o.shipping_street, o.shipping_number, o.shipping_neighborhood, o.shipping_city, o.shipping_state,
        o.shipping_postal_code, o.total, os.name AS status, o.created_at AS createdAt, oi.product_id AS productId, 
        p.name AS productName, oi.price, oi.quantity  
      FROM orders AS o
      INNER JOIN order_items AS oi
      on o.id = oi.order_id
      INNER JOIN products AS p
      on p.id = oi.product_id
      INNER JOIN customers AS c
      on c.id = o.customer_id
      INNER JOIN order_statuses AS os
      on os.id = o.status_id
      ORDER BY o.id DESC, oi.product_id ASC;`,
    );

    if (results.length > 0) {
      return this.groupItemsOrder(results);
    }
    return [];
  }

  async findById(id: number): Promise<IOrder | null> {
    const [result] = await this.pool.execute<OrderRowComplete[]>(
      `SELECT 
        o.id, o.customer_id AS customerId, CONCAT(c.first_name, " ", c.last_name) AS customer,
        o.shipping_street, o.shipping_number, o.shipping_neighborhood, o.shipping_city, o.shipping_state,
        o.shipping_postal_code, o.total, os.name AS status, o.created_at AS createdAt, oi.product_id AS productId, 
        p.name AS productName, oi.price, oi.quantity  
      FROM orders AS o
      INNER JOIN order_items AS oi
      on o.id = oi.order_id
      INNER JOIN products AS p
      on p.id = oi.product_id
      INNER JOIN customers AS c
      on c.id = o.customer_id
      INNER JOIN order_statuses AS os
      on os.id = o.status_id
      WHERE o.id = ?
      ORDER BY oi.product_id ASC;`,
      [id],
    );

    if (result.length > 0) {
      const orderArray = this.groupItemsOrder(result);
      if (orderArray.length > 0) {
        return orderArray[0];
      }
    }
    return null;
  }

  async createOrder(order: ICreateOrderInput): Promise<number> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const itemsId = order.items.map((item) => item.productId);
      const placeholders = itemsId.map(() => "?").join(", ");

      const [rows] = await connection.execute<ProductRow[]>(
        `SELECT id, name, price, stock 
        FROM products
        WHERE id IN (${placeholders})`,
        itemsId,
      );

      if (rows.length !== itemsId.length) {
        throw new Error("Uno o más productos no existen");
      }

      const rowsMapper = rows.map((row) => this.mapper.toProduct(row));

      const totalToPay = rowsMapper.reduce((total, item) => {
        const itemFound = order.items.find(
          (itemFind) => itemFind.productId === item.id,
        );

        if (!itemFound) {
          throw new Error(
            "Producto no encontrado en la lista para obtener su precio",
          );
        }

        return total + item.price * itemFound.quantity;
      }, 0);

      const [statusResult] = await connection.execute<IStatusOrder[]>(
        `SELECT id FROM order_statuses WHERE name = ?;`,
        ["pendiente"],
      );

      if (statusResult.length <= 0) {
        throw new Error("No se encontró el estado Pendienten");
      }

      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO orders
        (customer_id,
        shipping_street,
        shipping_number,
        shipping_neighborhood,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        total,
        status_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.customerId,
          order.shippingStreet,
          order.shippingNumber,
          order.shippingNeighborhood,
          order.shippingCity,
          order.shippingState,
          order.shippingPostalCode,
          totalToPay,
          statusResult[0].id,
        ],
      );

      const orderId = result.insertId;

      const queryItemsOrder: string[] = [];
      const paramsItemsOrder: number[] = [];

      for (const row of rowsMapper) {
        const item = order.items.find(
          (itemFind) => itemFind.productId === row.id,
        );

        if (!item) {
          throw new Error(
            "Produco no encontrado en la lista para obtener su precio y cantidad",
          );
        }
        await this.decreaseStock(connection, item.productId, item.quantity);

        queryItemsOrder.push("(?, ?, ?, ?)");
        paramsItemsOrder.push(
          orderId,
          item.productId,
          item.quantity,
          row.price,
        );
      }

      const [res] = await connection.execute<ResultSetHeader>(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ${queryItemsOrder.join(
          ", ",
        )};`,
        paramsItemsOrder,
      );

      if (rowsMapper.length !== res.affectedRows) {
        throw new Error("Error al insertar los items de la orden");
      }

      await connection.commit();

      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private async decreaseStock(
    connection: PoolConnection,
    productId: number,
    quantity: number,
  ): Promise<void> {
    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE products
                SET stock = stock - ?
                WHERE id = ? AND stock >= ?`,
      [quantity, productId, quantity],
    );

    if (result.affectedRows !== 1) {
      throw new Error(
        `Producto ${productId} inexistente o inventario insuficiente`,
      );
    }
  }

  private groupItemsOrder(results: OrderRowComplete[]): IOrder[] | [] {
    const orderWithItems = results.reduce((acc: Record<number, IOrder>, order: OrderRowComplete) => {
      const orderKey = order.id;
      const product = {
        productId: order.productId,
        nameProduct: order.productName,
        quantity: Number(order.quantity),
        price: Number(order.price),
      };

      if (!acc[orderKey]) {
        acc[orderKey] = {
          id: order.id,
          customerId: order.customerId,
          customer: order.customer,
          shippingStreet: order.shipping_street,
          shippingNumber: order.shipping_number,
          shippingNeighborhood: order.shipping_neighborhood,
          shippingCity: order.shipping_city,
          shippingState: order.shipping_state,
          shippingPostalCode: order.shipping_postal_code,
          total: Number(order.total),
          status: order.status,
          items: [product],
          createdAt: order.createdAt,
        };
      } else {
        acc[orderKey].items.push(product);
      }

      return acc;
    },{});

    return Object.values(orderWithItems);
  }
}

export default OrderRepository;
