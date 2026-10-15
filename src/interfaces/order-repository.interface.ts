import type { ICreateOrderInput } from "../schemas/order.schema.js";

export interface IOrderRepository {
    createOrder(order: ICreateOrderInput): Promise<number>;
}