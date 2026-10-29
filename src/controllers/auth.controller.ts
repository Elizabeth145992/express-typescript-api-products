import express from 'express';
import type { IAuthService } from '../interfaces/auth.service.interface.js';
import type { RegisterDTO } from '../schemas/auth.schema.js';

export const createAuthController = (authService: IAuthService) => {
    const createCustomer = async (req: express.Request, res: express.Response) => {
        const auth: RegisterDTO = req.body;
        const customerId = await authService.createCustomer(auth);

        res.status(201).json({
            id: customerId
        });
    }

    const login = async (req: express.Request, res: express.Response) => {
        const { email, password } = req.body;
        const loginResponse = await authService.login(email, password);

        res.status(200).json(loginResponse);
    }

    return {
        createCustomer,
        login
    }
}