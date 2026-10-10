import type { Pool, ResultSetHeader, PoolConnection } from "mysql2/promise";
import type { ICreateOrder } from "../types/order.types.js";
import type { ProductRow } from "../types/product-row.types.js";

class OrderRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createOrder(order: ICreateOrder): Promise<void> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();

      const itemsId = order.items.map((item) => item.productId);
      const placeholders = itemsId.map(() => "?").join(", ");

      const [rows] = await connection.query<ProductRow[]>(
        `SELECT id, name, price, stock 
        FROM products
        WHERE id IN (${placeholders})`,
        itemsId,
      );

      if (rows.length !== itemsId.length) {
        throw new Error("Uno o más productos no existen");
      }
      //IMPLEMENTAR MAPPER

      const totalToPay = rows.reduce((total, item) => {
        const itemFound = order.items.find(
          (itemFind) => itemFind.productId === item.id,
        );

        if (!itemFound) {
          throw new Error(
            "Produco no encontrado en la lista para obtener su precio",
          );
        }

        return total + item.price * itemFound.quantity;
      }, 0);

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
          0,
          1,
        ],
      );

      const orderId = result.insertId;

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async decreaseStock(
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
}
