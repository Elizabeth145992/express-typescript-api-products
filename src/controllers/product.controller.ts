import express from "express";
import ProductService from "../services/product.service.js";
import type { ICreateProduct, IUpdateProduct } from "../types/product.types.js";

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
        return res.status(404).json({
            message: "Producto no encontrado",
        });
    }
    res.json(product);
}

export const createProduct = (
    req: express.Request,
    res: express.Response
) => {
    const { name, price }: ICreateProduct = req.body;

    const newProduct = productService.create(name, price);
    res.status(201).json(newProduct);
}

export const updateProduct = (
    req: express.Request,
    res: express.Response,
) => {
    const productId = Number(req.params.id);
    const { name, price }: ICreateProduct = req.body;

    const product = productService.update(productId, name, price);

    if (!product) {
        return res.status(404).json({
            message: "Producto no encontrado para actuallizar",
        });
    }

    res.status(200).json(product);
}

export const patchProduct = (
  req: express.Request,
  res: express.Response
) => {
  const productId = Number(req.params.id);

  const { name, price }: IUpdateProduct = req.body;

  const product = productService.patch(
    productId,
    name,
    price
  );

  if (!product) {
    return res.status(404).json({
      message: "Producto no encontrado",
    });
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
        return res.status(404).json({
            message: "Producto no encontrado para su eliminación",
        });
    }

    res.status(200).json({
        message: "Producto eliminado con éxito",
    });
}