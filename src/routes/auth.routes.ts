import express from 'express';
import pool from '../database/connection.js';
import { validateAuth } from '../middlewares/validateAuth.js';
import { validateLogin } from '../middlewares/validateLogin.js';
import AuthRepository from '../repositories/auth.repository.js';
import AuthService from '../services/auth.service.js';
import { createAuthController } from '../controllers/auth.controller.js';

const authRepository = new AuthRepository(pool);
const authService = new AuthService(authRepository);

const router = express.Router();
const authController = createAuthController(authService);

router.post('/register', validateAuth, authController.createCustomer);
router.post('/login', validateLogin, authController.login);

export default router;
