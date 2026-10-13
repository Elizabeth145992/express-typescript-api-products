import AppError from "../errors/AppError.js";
import type { IOrderService } from "../interfaces/order-service.interface.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";

class OrderService implements IOrderService {
    private repository: IOrderRepository;

    constructor(repository: IOrderRepository) {
        this.repository = repository;
    }

    async createOrder(): Promise<number> {
        return 1;
    }
}

export default OrderService;