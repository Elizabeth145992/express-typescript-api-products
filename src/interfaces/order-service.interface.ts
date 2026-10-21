import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { IOrder } from "../types/order.types.js";

export interface IOrderService {
    createOrder(order: ICreateOrderInput): Promise<number>;
    findAll(): Promise<IOrder[]>;
    findById(id: number): Promise<IOrder>;
}