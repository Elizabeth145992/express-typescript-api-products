import express from 'express';
import { registerSchema } from '../schemas/auth.schema.js';
import { createValidationError } from '../utils/validationError.js';

export const validateAuth = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        throw createValidationError(result.error.issues);
    }

    next();
}