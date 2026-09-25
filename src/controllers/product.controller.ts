import express from "express";
import ProductService from "../services/product.service.js";
import AppError from "../errors/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../schemas/product.schema.js";

const productService = new ProductService();

export const getProducts = async (
  req: express.Request,
  res: express.Response
) => {
    const products = await productService.getAll();
    res.json(products);
};

export const getProductById = async (
  req: express.Request,
  res: express.Response
) => {
    const productId = Number(req.params.id);
    const product = await productService.getById(productId);

    res.json(product);
}

export const createProduct = async (
    req: express.Request,
    res: express.Response
) => {
    const { name, price, stock }: CreateProductDTO = req.body;

    const newProduct = await productService.create(name, price, stock);
    res.status(201).json(newProduct);
}

export const updateProduct = async (
    req: express.Request,
    res: express.Response,
) => {
    const id = Number(req.params.id);
    const { name, price, stock }: CreateProductDTO = req.body;

    const product = await productService.update(id, name, price, stock);

    res.status(200).json(product);
}

export const patchProduct = async (
  req: express.Request,
  res: express.Response
) => {
  const productId = Number(req.params.id);

  const { name, price, stock }: UpdateProductDTO = req.body;

  const product = await productService.patch(
    productId,
    name,
    price,
    stock
  );

  res.status(200).json(product);
};

export const deleteProduct = async (
    req: express.Request,
    res: express.Response,
) => {
    const productId = Number(req.params.id);

    const isDeleted = await productService.delete(productId);

    res.status(200).json({
        message: "Producto eliminado con éxito",
    });
}