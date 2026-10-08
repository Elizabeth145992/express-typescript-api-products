import { beforeAll, afterAll, beforeEach } from "@jest/globals";
import setupTestDatabase from "../database/setupTestDatabase.js";
import testPool from "../database/testConnection.js";
import ProductRepository from "../repositories/product.repository.js";

beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
    await testPool.query("DELETE FROM products;");
});

afterAll(async () => {
  await testPool.end();
});

const productRepository = new ProductRepository(testPool);

describe("ProductRepository", () => {
  it("should create a product", async () => {
    const productId = await productRepository.create("Test Product", 100, 10);

    if (productId === null) {
      throw new Error("Failed to create product");
    }
    
    const product = await productRepository.findById(productId);
    if (product === null) {
      throw new Error("Product not found after creation");
    }

    expect(product.name).toBe("Test Product");
    expect(product.price).toBe(100);
    expect(product.stock).toBe(10);
  });

  it("should get product by id", async () => {
    const productId = await productRepository.create("Tablet", 350.15, 15);

    if (productId === null) {
        throw new Error("Failed to create product.");
    }

    const product = await productRepository.findById(productId);

    if (product === null) {
        throw new Error("Product not found after creation");
    }

    expect(product.name).toBe("Tablet");
    expect(product.price).toBe(350.15);
    expect(product.stock).toBe(15);
  });

  it("should return null when product does not exist", async () => {
    const product = await productRepository.findById(999);

    expect(product).toBeNull();
  });

  it("should get all products", async () => {
    const productId1 = await productRepository.create("Product test 1", 150, 5);
    const productId2 = await productRepository.create("Product test 2", 200.50, 3);

    if (productId1 === null || productId2 === null) {
        throw new Error("Failed to create products.")
    }

    const products = await productRepository.findAll();
    expect(products).toEqual([
        {
            id: productId1,
            name: "Product test 1",
            price: 150,
            stock: 5
        },
        {
            id: productId2,
            name: "Product test 2",
            price: 200.50,
            stock: 3
        }
    ]);
  });
});
