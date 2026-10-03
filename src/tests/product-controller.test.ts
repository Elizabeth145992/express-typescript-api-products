import { jest } from "@jest/globals";
import type { IProduct } from "../types/product.types.js";
import { createProductController } from "../controllers/product.controller.js";
import type { IProductService } from "../interfaces/product-service.interface.js";

const jsonMock = jest.fn();
const res = {
  json: jsonMock,
};
const getAllMock = jest.fn<() => Promise<IProduct[]>>();

const mockProductService: IProductService = {
  getAll: getAllMock,
  getById: jest.fn<() => Promise<IProduct>>(),
  create: jest.fn<() => Promise<IProduct>>(),
  update: jest.fn<() => Promise<IProduct>>(),
  patch: jest.fn<() => Promise<IProduct>>(),
  delete: jest.fn<() => Promise<void>>(),
};

const productController = createProductController(mockProductService);

describe("ProductController", () => {
  it("should return a list of products when getProducts is called", async () => {
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

    getAllMock.mockResolvedValue(products);
    await productController.getProducts({} as any, res as any);

    expect(getAllMock).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(products);
  });
});
