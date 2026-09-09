import express from "express";
import type { IUpdateProduct } from "../types/product.types.js";

export const validatePatchProduct = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const { name, price }: IUpdateProduct = req.body;

    if (name === undefined && price === undefined) {
    return res.status(400).json({
      message: "Debes proporcionar al menos un campo para actualizar",
    });
  }

  if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({
      message: "Name debe ser un texto",
    });
  }

  if (price !== undefined && typeof price !== "number") {
    return res.status(400).json({
      message: "Price debe ser un número",
    });
  }

  next();
}
