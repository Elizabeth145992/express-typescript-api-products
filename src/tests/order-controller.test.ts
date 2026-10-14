import { jest } from "@jest/globals";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import { createOrderController } from "../controllers/order.controller.js";
import type { IOrderService } from "../interfaces/order-service.interface.js";

const jsonMock = jest.fn();
const res = {
  json: jsonMock,
};
const createOrderMock = jest.fn<
  (order: ICreateOrderInput) => Promise<number>
>();

const mockOrderService: IOrderService = {
  createOrder: createOrderMock,
};

const orderController = createOrderController(mockOrderService);

describe("OrderController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const body = {
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

  it("should create new order when createOrder is called with a valid data", async () => {
    createOrderMock.mockResolvedValue(1);

    const req = {
      body,
    };
    const statusMock = jest.fn().mockReturnThis();
    const resCreateOrder = {
      status: statusMock,
      json: jsonMock,
    };
    await orderController.createOrder(req as any, resCreateOrder as any);

    expect(createOrderMock).toHaveBeenCalledWith(body);
    expect(statusMock).toHaveBeenLastCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(1);
  });

  it("should propagate service errors", async () => {
    const error = new Error("Error al crear la orden");
    createOrderMock.mockRejectedValueOnce(error);

    await expect(
      orderController.createOrder(
        { body } as any,
        { status: jest.fn(), json: jsonMock } as any,
      ),
    ).rejects.toThrow("Error al crear la orden");
  });
});
