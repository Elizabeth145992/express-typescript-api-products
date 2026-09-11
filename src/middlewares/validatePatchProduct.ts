import express from "express";
import { updateProductSchema } from "../schemas/product.schema.js";
import { createValidationError } from "../utils/validationError.js";


export const validatePatchProduct = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
  const result = updateProductSchema.safeParse(req.body);

  if (!result.success) {
    throw createValidationError(result.error.issues);
  }

  next();
}
