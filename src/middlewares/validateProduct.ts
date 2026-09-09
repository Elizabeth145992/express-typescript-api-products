import express from "express";
import type { ICreateProduct } from "../types/product.types.js";

export const validateProduct = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const { name, price }: ICreateProduct = req.body;

    if (name === undefined || typeof name !== "string" || price === undefined || typeof price !== "number") {
        return res.status(400).json({
            message: "Name es obligatorio y debe ser un texto. Price es obligatorio y debe ser un número",
        });
    }

    next();
};