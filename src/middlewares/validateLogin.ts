import express from 'express';
import { loginSchema } from '../schemas/auth.schema.js';
import { createValidationError } from '../utils/validationError.js';

export const validateLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        throw createValidationError(result.error.issues);
    }

    next();
}