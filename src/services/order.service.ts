import type { IOrderService } from "../interfaces/order-service.interface.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";

class OrderService implements IOrderService {
    private repository: IOrderRepository;

    constructor(repository: IOrderRepository) {
        this.repository = repository;
    }

    async createOrder(order: ICreateOrderInput): Promise<number> {
        return this.repository.createOrder(order);
    }
}

export default OrderService;