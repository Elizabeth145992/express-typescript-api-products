import express from "express";
import pool from "../database/connection.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import OrderRepository from "../repositories/order.repository.js";
import OrderService from "../services/order.service.js";
import { createOrderController } from "../controllers/order.controller.js";

const orderRepository = new OrderRepository(pool);
const orderService = new OrderService(orderRepository);

const router = express.Router();
const orderController = createOrderController(orderService);

router.post("/", validateOrder, orderController.createOrder);
router.get("/", orderController.findAll);
router.get("/:id", orderController.findById)

export default router;