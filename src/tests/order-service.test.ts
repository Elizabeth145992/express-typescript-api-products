import { jest } from "@jest/globals";
import OrderService from "../services/order.service.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";

const createOrderMock = jest.fn<
  (order: ICreateOrderInput) => Promise<number>
>();
const mockRepository: IOrderRepository = {
  createOrder: createOrderMock,
};

const orderService = new OrderService(mockRepository);

describe("OrderService", () => {
  const order = {
    customerId: 1,
    shippingStreet: "Abasolo",
    shippingNumber: "23",
    shippingNeighborhood: "Centro",
    shippingCity: "Uriangato",
    shippingState: "Guanajuato",
    shippingPostalCode: "38980",
    items: [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 3,
      },
    ],
  };
  
  it("should create a new order when createOrder is called with valid data", async () => {
    createOrderMock.mockResolvedValue(1);
    const orderId = await orderService.createOrder(order);

    expect(createOrderMock).toHaveBeenCalledWith(order);
    expect(orderId).toEqual(1);
  });

  it("should propagate repository errors", async () => {
    const error = new Error("Error al crear la orden");
    createOrderMock.mockRejectedValueOnce(error);

    await expect(orderService.createOrder(order)).rejects.toThrow(
      "Error al crear la orden",
    );
  });
});
