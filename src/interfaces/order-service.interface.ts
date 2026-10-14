import type { ICreateOrderInput } from "../schemas/order.schema.js";

export interface IOrderService {
    createOrder(order: ICreateOrderInput): Promise<number>;
}