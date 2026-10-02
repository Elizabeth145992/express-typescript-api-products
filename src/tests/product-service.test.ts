import { jest } from "@jest/globals";
import ProductService from "../services/product.service.js";
import type { IProductRepository } from "../interfaces/product-repository.interface.js";
import type { IProduct } from "../types/product.types.js";

const findByIdMock = jest.fn<(id: number) => Promise<IProduct | null>>();
const findAllMock = jest.fn<() => Promise<IProduct[]>>();
const createMock = jest.fn<
  (name: string, price: number, stock: number) => Promise<number | null>
>();
const updateMock = jest.fn<
  (id: number, name: string, price: number, stock: number) => Promise<boolean>
>();

const mockRepository: IProductRepository = {
  findById: findByIdMock,
  findAll: findAllMock,
  create: createMock,
  update: updateMock,
  patch: jest.fn<
    (
      id: number,
      name?: string,
      price?: number,
      stock?: number,
    ) => Promise<boolean>
  >(),
  delete: jest.fn<(id: number) => Promise<boolean>>(),
};

const productService = new ProductService(mockRepository);

describe("ProductService", () => {
  it("should return a product when getById is called with a valid id", async () => {
    findByIdMock.mockResolvedValue({
      id: 1,
      name: "Mouse",
      price: 39.49,
      stock: 12,
    });
    const product = await productService.getById(1);

    expect(findByIdMock).toHaveBeenCalledWith(1);
    expect(product).toEqual({
      id: 1,
      name: "Mouse",
      price: 39.49,
      stock: 12,
    });
  });

  it("should throw an error when getById is called with an invalid id", async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(productService.getById(999)).rejects.toThrow(
      "Producto no encontrado",
    );
  });

  it("Should return all products when getAll is called", async () => {
    const products = [
      {
        id: 1,
        name: "Mouse",
        price: 39.49,
        stock: 12,
      },
      {
        id: 2,
        name: "Laptop",
        price: 350.85,
        stock: 5,
      },
    ];
    findAllMock.mockResolvedValue(products);
    const allProducts = await productService.getAll();

    expect(findAllMock).toHaveBeenCalled();
    expect(allProducts).toEqual(products);
  });

  it("should create a new product when create is called with valid data", async () => {
    createMock.mockResolvedValue(7);
    findByIdMock.mockResolvedValueOnce({
      id: 7,
      name: "Tablet",
      price: 150.2,
      stock: 10,
    });

    const product = await productService.create("Tablet", 150.2, 10);

    expect(createMock).toHaveBeenCalledWith("Tablet", 150.2, 10);
    expect(findByIdMock).toHaveBeenCalledWith(7);
    expect(product).toEqual({
      id: 7,
      name: "Tablet",
      price: 150.2,
      stock: 10,
    });
  });

  it("should throw an error when create is called and the product cannot be created", async () => {
    createMock.mockResolvedValueOnce(null);

    await expect(productService.create("Tablet", 150.2, 10)).rejects.toThrow(
      "No se pudo crear el producto",
    );
  });

  it("should throw an error when create is called and the product is not found after creation", async () => {
    createMock.mockResolvedValueOnce(7);
    findByIdMock.mockResolvedValueOnce(null);

    await expect(productService.create("Tablet", 150.2, 10)).rejects.toThrow(
      "Producto creado pero no encontrado",
    );
  });

  it("should update a product when update is called with valid data", async () => {
    updateMock.mockResolvedValue(true);
    findByIdMock.mockResolvedValueOnce({
      id: 7,
      name: "Tablet Pro",
      price: 200,
      stock: 15,
    });

    const product = await productService.update(7, "Tablet Pro", 200, 15);

    expect(updateMock).toHaveBeenCalledWith(7, "Tablet Pro", 200, 15);
    expect(findByIdMock).toHaveBeenCalledWith(7);
    expect(product).toEqual({
      id: 7,
      name: "Tablet Pro",
      price: 200,
      stock: 15,
    });
  });

  it("should throw an error when update is called and the product cannot be updated", async () => {
    updateMock.mockResolvedValueOnce(false);

    await expect(
      productService.update(7, "Tablet Pro", 200, 15),
    ).rejects.toThrow("Producto no actualizado con el id: 7");
  });

  it("should throw an error when update is called and the product is not found after update", async () => {
    updateMock.mockResolvedValueOnce(true);
    findByIdMock.mockResolvedValueOnce(null);

    await expect(
      productService.update(7, "Tablet Pro", 200, 15),
    ).rejects.toThrow("Producto actualizado, pero no encontrado");
  });
});
