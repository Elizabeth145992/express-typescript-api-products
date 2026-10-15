import { beforeAll, afterAll, beforeEach } from "@jest/globals";

import setupTestDatabase from "../database/setupTestDatabase.js";
import teardownTestDatabase from "../database/teardownTestDatabase.js";
import testPool from "../database/testConnection.js";
import OrderRepository from "../repositories/order.repository.js";
import { createTestCustomer } from "./helpers/customer.helper.js";
import { createTestProduct } from "./helpers/product.helper.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import { insertStatusOrder } from "./helpers/order_status.helper.js";
import type { OrderRow } from "../types/order-row-types.js";
import type { OrderItemRow } from "../types/orderItem-row-types.js";
import type { ProductRow } from "../types/product-row.types.js";

const orderRepository = new OrderRepository(testPool);

beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
  await testPool.query("DELETE FROM order_items;");
  await testPool.query("DELETE FROM orders;");
  await testPool.query("DELETE FROM products;");
  await testPool.query("DELETE FROM customers;");
  await testPool.query("DELETE FROM order_statuses;");
});

afterAll(async () => {
  await testPool.end();
  await teardownTestDatabase();
});

describe("OrderRepository", () => {
  it("should create a order", async () => {
    const customerId = await createTestCustomer();
    await insertStatusOrder();
    const productId1 = await createTestProduct({
      name: "Laptop",
      price: 500,
      stock: 10,
    });

    const productId2 = await createTestProduct({
      name: "Mouse",
      price: 100,
      stock: 2,
    });

    const order: ICreateOrderInput = {
      customerId,
      shippingStreet: "Abasolo",
      shippingNumber: "8",
      shippingNeighborhood: "Centro",
      shippingCity: "Uriangato",
      shippingState: "Guanajuato",
      shippingPostalCode: "38980",
      items: [
        {
          productId: productId1,
          quantity: 2,
        },
        {
          productId: productId2,
          quantity: 1,
        },
      ],
    };

    const orderId = await orderRepository.createOrder(order);

    expect(orderId).toEqual(expect.any(Number));
    expect(orderId).toBeGreaterThan(0);

    const [newOrder] = await testPool.execute<OrderRow[]>(
      "SELECT * FROM orders WHERE id = ?;",
      [orderId],
    );

    expect(orderId).toEqual(newOrder[0].id);
    expect(Number(newOrder[0].customer_id)).toBe(customerId);
    expect(Number(newOrder[0].total)).toBe(1100);

    const [orderItems] = await testPool.execute<OrderItemRow[]>(
      "SELECT * FROM order_items WHERE order_id = ? ORDER BY id;",
      [orderId],
    );
    expect(orderItems.length).toBe(2);

    const laptopItem = orderItems.find(
      (item) => item.product_id === productId1,
    );

    const mouseItem = orderItems.find((item) => item.product_id === productId2);

    expect(laptopItem).toBeDefined();
    expect(Number(laptopItem!.quantity)).toBe(2);
    expect(Number(laptopItem!.price)).toBe(500);

    expect(mouseItem).toBeDefined();
    expect(Number(mouseItem!.quantity)).toBe(1);
    expect(Number(mouseItem!.price)).toBe(100);

    const [products] = await testPool.execute<ProductRow[]>(
      "SELECT id, name, price, stock FROM products WHERE id IN (?, ?)",
      [productId1, productId2],
    );

    const laptopProduct = products.find((product) => product.id === productId1);
    const mouseProduct = products.find((product) => product.id === productId2);

    if (!laptopProduct || !mouseProduct) {
      throw new Error("No se encuntra alguno de los productos registrados");
    }

    expect(laptopProduct.stock).toBe(8);
    expect(mouseProduct.stock).toBe(1);
  });

  it("should failed to create order when insufficient stock", async () => {
    const customerId = await createTestCustomer();
    await insertStatusOrder();
    const productId1 = await createTestProduct({
      name: "Laptop",
      price: 500,
      stock: 10,
    });

    const productId2 = await createTestProduct({
      name: "Mouse",
      price: 100,
      stock: 1,
    });

    const order: ICreateOrderInput = {
      customerId,
      shippingStreet: "Abasolo",
      shippingNumber: "8",
      shippingNeighborhood: "Centro",
      shippingCity: "Uriangato",
      shippingState: "Guanajuato",
      shippingPostalCode: "38980",
      items: [
        {
          productId: productId1,
          quantity: 3,
        },
        {
          productId: productId2,
          quantity: 2,
        },
      ],
    };

    await expect(orderRepository.createOrder(order)).rejects.toThrow(
      `Producto ${productId2} inexistente o inventario insuficiente`,
    );

    const [orderCustomer] = await testPool.execute<OrderRow[]>(
      "SELECT * FROM orders WHERE customer_id = ?;",
      [customerId],
    );
    expect(orderCustomer.length).toBe(0);

    const [orderItems] = await testPool.execute<OrderItemRow[]>(
      "SELECT * FROM order_items WHERE product_id in (?, ?);",
      [productId1, productId2],
    );
    expect(orderItems.length).toBe(0);

    const [products] = await testPool.execute<ProductRow[]>(
      "SELECT id, name, price, stock FROM products WHERE id IN (?, ?)",
      [productId1, productId2],
    );

    const laptopProduct = products.find((product) => product.id === productId1);
    const mouseProduct = products.find((product) => product.id === productId2);

    if (!laptopProduct || !mouseProduct) {
      throw new Error("No se encuntra alguno de los productos registrados");
    }

    expect(laptopProduct.stock).toBe(10);
    expect(mouseProduct.stock).toBe(1);
  });
});
