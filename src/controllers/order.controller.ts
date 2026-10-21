import express from "express";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { IOrderService } from "../interfaces/order-service.interface.js";

export const createOrderController = (orderService: IOrderService) => {
  const findAll = async(req: express.Request, res: express.Response) => {
    const orders = await orderService.findAll();

    res.json(orders);
  }

  const findById = async(req: express.Request, res: express.Response) => {
    const orderId = Number(req.params.id);
    const order = await orderService.findById(orderId);

    res.json(order);
  }

  const createOrder = async (req: express.Request, res: express.Response) => {
    const order: ICreateOrderInput = req.body;
    
    const orderId = await orderService.createOrder(order);

    res.status(201).json(orderId);
  };

  return {
    createOrder,
    findAll,
    findById
  };
};
