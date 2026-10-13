import express from "express";
import pool from "../database/connection.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import OrderRepository from "../repositories/order.repository.js";

const orderRepositoty = new OrderRepository(pool);

const router = express.Router();

export default router;