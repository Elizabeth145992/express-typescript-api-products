import express from "express";
import { createOrderSchema } from "../schemas/order.schema.js";
import { createValidationError } from "../utils/validationError.js";

export const validateOrder = (
  req: express.Request,
  res: express.Request,
  next: express.NextFunction,
) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
    throw createValidationError(result.error.issues);
  }

  next();
};
