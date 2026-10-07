import express from "express";
import type {
  CreateProductDTO,
  UpdateProductDTO,
} from "../schemas/product.schema.js";
import type { IProductService } from "../interfaces/product-service.interface.js";

export const createProductController = (productService: IProductService) => {
  const getProducts = async (req: express.Request, res: express.Response) => {
    const products = await productService.getAll();
    res.json(products);
  };

  const getProductById = async (
    req: express.Request,
    res: express.Response,
  ) => {
    const productId = Number(req.params.id);
    const product = await productService.getById(productId);

    res.json(product);
  };

  const createProduct = async (req: express.Request, res: express.Response) => {
    const { name, price, stock }: CreateProductDTO = req.body;

    const newProduct = await productService.create(name, price, stock);
    res.status(201).json(newProduct);
  };

  const updateProduct = async (req: express.Request, res: express.Response) => {
    const id = Number(req.params.id);
    const { name, price, stock }: CreateProductDTO = req.body;

    const product = await productService.update(id, name, price, stock);

    res.status(200).json(product);
  };

  const patchProduct = async (req: express.Request, res: express.Response) => {
    const productId = Number(req.params.id);

    const { name, price, stock }: UpdateProductDTO = req.body;

    const product = await productService.patch(productId, name, price, stock);

    res.status(200).json(product);
  };

  const deleteProduct = async (req: express.Request, res: express.Response) => {
    const productId = Number(req.params.id);

    await productService.delete(productId);

    res.status(200).json({
      message: "Producto eliminado con éxito",
    });
  };

  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
  }
};
