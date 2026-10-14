import express from "express";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { IOrderService } from "../interfaces/order-service.interface.js";

export const createOrderController = (orderService: IOrderService) => {
  const createOrder = async (req: express.Request, res: express.Response) => {
    const order: ICreateOrderInput = req.body;
    
    const orderId = await orderService.createOrder(order);

    res.status(201).json(orderId);
  };

  return {
    createOrder,
  };
};
