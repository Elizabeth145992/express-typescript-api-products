import express from "express";
import ProductService from "../services/product.service.js";
import AppError from "../errors/AppError.js";
import type { CreateProductDTO, UpdateProductDTO } from "../schemas/product.schema.js";

const productService = new ProductService();

export const getProducts = (
  req: express.Request,
  res: express.Response
) => {
    const products = productService.getAll();
    res.json(products);
};

export const getProductById = (
  req: express.Request,
  res: express.Response
) => {
    const productId = Number(req.params.id);
    const product = productService.getById(productId);

    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }
    res.json(product);
}

export const createProduct = (
    req: express.Request,
    res: express.Response
) => {
    const { name, price }: CreateProductDTO = req.body;

    const newProduct = productService.create(name, price);
    res.status(201).json(newProduct);
}

export const updateProduct = (
    req: express.Request,
    res: express.Response,
) => {
    const productId = Number(req.params.id);
    const { name, price }: CreateProductDTO = req.body;

    const product = productService.update(productId, name, price);

    if (!product) {
        throw new AppError("Producto no encontrado", 404);
    }

    res.status(200).json(product);
}

export const patchProduct = (
  req: express.Request,
  res: express.Response
) => {
  const productId = Number(req.params.id);

  const { name, price }: UpdateProductDTO = req.body;

  const product = productService.patch(
    productId,
    name,
    price
  );

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.status(200).json(product);
};

export const deleteProduct = (
    req: express.Request,
    res: express.Response,
) => {
    const productId = Number(req.params.id);

    const isDeleted = productService.delete(productId);

    if (!isDeleted) {
        throw new AppError("Producto no encontrado", 404);
    }

    res.status(200).json({
        message: "Producto eliminado con éxito",
    });
}