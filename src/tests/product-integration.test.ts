import { beforeAll, afterAll, beforeEach } from "@jest/globals";
import setupTestDatabase from "../database/setupTestDatabase.js";
import teardownTestDatabase from "../database/teardownTestDatabase.js";
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
  await teardownTestDatabase();
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

  it("should update product by id", async () => {
    const productId = await productRepository.create("Laptop", 2500.25, 10);

    if (productId === null) {
      throw new Error("Failed to create product.");
    }
    const isProductUpdated = await productRepository.update(productId, "Laptop Pro", 2550.25, 8);

    expect(isProductUpdated).toBe(true);

    const productUpdated = await productRepository.findById(productId);
    if (productUpdated === null) {
      throw new Error("Product no found after update.");
    }

    expect(productUpdated.name).toEqual("Laptop Pro");
    expect(productUpdated.price).toEqual(2550.25);
    expect(productUpdated.stock).toEqual(8);
  });

  it("should return false when does not exist product to update", async () => {
    const isUpdatedProduct = await productRepository.update(999, "Keyboard Pro", 100.20, 3);

    expect(isUpdatedProduct).toBe(false);
  });

  it("should patch product by id", async () => {
    const productId = await productRepository.create("Mouse", 55.10, 20);

    if (productId === null) {
      throw new Error("Failed to create product.");
    }

    const isUpdatedProduct = await productRepository.patch(productId, undefined, undefined, 18);

    if (!isUpdatedProduct) {
      throw new Error("Failed to patch product.");
    }

    const product = await productRepository.findById(productId);

    if (product === null) {
      throw new Error("Product not found after patch");
    }

    expect(product.name).toEqual("Mouse");
    expect(product.price).toEqual(55.10);
    expect(product.stock).toEqual(18);
  });

  it("should return false when patching a non-existent product", async () => {
    const isUpdatedProduct = await productRepository.patch(999, undefined, undefined, 5);
    
    expect(isUpdatedProduct).toBe(false);
  });

  it("should delete product", async () => {
    const productId = await productRepository.create("HeadPhone", 75.80, 5);

    if (productId === null) {
      throw new Error("Faled to create product.");
    }

    const isDeletedProduct = await productRepository.delete(productId);

    expect(isDeletedProduct).toBe(true);

    const product = await productRepository.findById(productId);

    expect(product).toBeNull();
  });

  it("should return false when deleting a non-existent product", async () => {
    const isProductDeleted = await productRepository.delete(999);

    expect(isProductDeleted).toBe(false);
  });
});
