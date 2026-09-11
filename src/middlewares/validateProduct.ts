import express from "express";
import { createProductSchema } from "../schemas/product.schema.js";
import { createValidationError } from "../utils/validationError.js";

export const validateProduct = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const result = createProductSchema.safeParse(req.body);

  if (!result.success) {
    throw createValidationError(result.error.issues);
  }

  next();
};
