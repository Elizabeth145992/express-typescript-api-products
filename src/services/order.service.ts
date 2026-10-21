import type { IOrderService } from "../interfaces/order-service.interface.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { IOrder } from "../types/order.types.js";
import AppError from "../errors/AppError.js";

class OrderService implements IOrderService {
    private repository: IOrderRepository;

    constructor(repository: IOrderRepository) {
        this.repository = repository;
    }

    async findAll(): Promise<IOrder[]> {
        return this.repository.findAll();
    }

    async findById(id: number): Promise<IOrder> {
        const order = await this.repository.findById(id);

        if (order === null) {
            throw new AppError("La orden no fue encontrada", 401);
        }

        return order;
    }

    async createOrder(order: ICreateOrderInput): Promise<number> {
        return this.repository.createOrder(order);
    }
}

export default OrderService;