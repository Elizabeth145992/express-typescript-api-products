import { jest } from "@jest/globals";
import type { IProduct } from "../types/product.types.js";
import { createProductController } from "../controllers/product.controller.js";
import type { IProductService } from "../interfaces/product-service.interface.js";

const jsonMock = jest.fn();
const res = {
  json: jsonMock,
};
const getAllMock = jest.fn<() => Promise<IProduct[]>>();
const getByIdMock = jest.fn<() => Promise<IProduct>>();
const createMock = jest.fn<() => Promise<IProduct>>();
const updateMock = jest.fn<() => Promise<IProduct>>();
const patchMock = jest.fn<() => Promise<IProduct>>();
const deleteMock = jest.fn<() => Promise<void>>();

const mockProductService: IProductService = {
  getAll: getAllMock,
  getById: getByIdMock,
  create: createMock,
  update: updateMock,
  patch: patchMock,
  delete: deleteMock,
};

const productController = createProductController(mockProductService);

describe("ProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("should return a product when getProductById is called with a valid id", async () => {
    const product = {
      id: 1,
      name: "Mouse",
      price: 39.49,
      stock: 12,
    };

    getByIdMock.mockResolvedValue(product);
    await productController.getProductById(
      { params: { id: "1" } } as any,
      res as any,
    );
    expect(getByIdMock).toHaveBeenCalledWith(1);
    expect(jsonMock).toHaveBeenCalledWith(product);
  });

  it("should create a new product when createProduct is called", async () => {
    const newProduct = {
      id: 3,
      name: "Tablet",
      price: 200.0,
      stock: 10,
    };
    createMock.mockResolvedValue(newProduct);

    const req = {
      body: {
        name: "Tablet",
        price: 200.0,
        stock: 10,
      },
    };

    const statusMock = jest.fn().mockReturnThis();
    const resCreate = {
      status: statusMock,
      json: jsonMock,
    };

    await productController.createProduct(req as any, resCreate as any);

    expect(createMock).toHaveBeenCalledWith("Tablet", 200.0, 10);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(newProduct);
  });

  it("should update a product when updateProduct is called", async () => {
    const productUpdated = {
      id: 3,
      name: "Tablet Pro",
      price: 220.35,
      stock: 8,
    };
    updateMock.mockResolvedValue(productUpdated);

    const req = {
      params: { id: "3" },
      body: {
        name: "Tablet Pro",
        price: 220.35,
        stock: 8,
      },
    };

    const statusMock = jest.fn().mockReturnThis();
    const resUpdated = {
      status: statusMock,
      json: jsonMock,
    };

    await productController.updateProduct(req as any, resUpdated as any);

    expect(updateMock).toHaveBeenCalledWith(3, "Tablet Pro", 220.35, 8);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(productUpdated);
  });

  it("should patch a product when patchProduct is called", async () => {
    const productPatched = {
      id: 3,
      name: "Tablet pro",
      price: 250.5,
      stock: 6,
    };

    patchMock.mockResolvedValue(productPatched);

    const req = {
      params: { id: "3" },
      body: {
        price: 250.5,
        stock: 6,
      },
    };

    const statusMock = jest.fn().mockReturnThis();
    const resPatched = {
      status: statusMock,
      json: jsonMock,
    };

    await productController.patchProduct(req as any, resPatched as any);

    expect(patchMock).toHaveBeenCalledWith(3, undefined, 250.5, 6);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(productPatched);
  });

  it("should delete a product when deleteProduct is called", async () => {
    const statusMock = jest.fn().mockReturnThis();
    const resDeleted = {
      status: statusMock,
      json: jsonMock,
    };
    await productController.deleteProduct(
      { params: { id: "3" } } as any,
      resDeleted as any,
    );

    expect(deleteMock).toHaveBeenCalledWith(3);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Producto eliminado con éxito",
    });
  });

  it("should throw an error when getProductById is called and the product cannot be found", async () => {
    getByIdMock.mockRejectedValueOnce(new Error("Producto no encontrado"));

    await expect(
      productController.getProductById({ params: { id: "999" } } as any, {} as any),
    ).rejects.toThrow("Producto no encontrado");
  });
});
