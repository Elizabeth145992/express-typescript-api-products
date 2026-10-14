import { beforeAll, afterAll, beforeEach } from "@jest/globals";

import setupTestDatabase from "../database/setupTestDatabase.js";
import teardownTestDatabase from "../database/teardownTestDatabase.js";
import testPool from "../database/testConnection.js";
import OrderRepository from "../repositories/order.repository.js";
import { createTestCustomer } from "./helpers/customer.helper.js";
import { createTestProduct } from "./helpers/product.helper.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import { insertStatusOrder } from "./helpers/order_status.helper.js";

const orderRepository = new OrderRepository(testPool);

beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
  await testPool.query("DELETE FROM order_items;");
  await testPool.query("DELETE FROM orders;");
  await testPool.query("DELETE FROM products;");
  await testPool.query("DELETE FROM customers;");
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
  });
});
