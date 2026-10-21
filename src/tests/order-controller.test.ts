import { jest } from "@jest/globals";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import { createOrderController } from "../controllers/order.controller.js";
import type { IOrderService } from "../interfaces/order-service.interface.js";
import type { IOrder } from "../types/order.types.js";

const jsonMock = jest.fn();
const res = {
  json: jsonMock,
};
const createOrderMock = jest.fn<
  (order: ICreateOrderInput) => Promise<number>
>();
const findAllMock = jest.fn<() => Promise<IOrder[]>>();
const findByIdMock = jest.fn<(id: number) => Promise<IOrder>>();

const mockOrderService: IOrderService = {
  createOrder: createOrderMock,
  findAll: findAllMock,
  findById: findByIdMock,
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

  const orders = [
    {
      id: 1,
      customerId: 1,
      customer: "Elizabeth Cruz",
      shippingStreet: "Abasolo",
      shippingNumber: "45A",
      shippingNeighborhood: "Centro",
      shippingCity: "Uriangato",
      shippingState: "Guanajuato",
      shippingPostalCode: "38980",
      total: 2585,
      status: "pendiente",
      items: [
        {
          productId: 1,
          nameProduct: "Laptop",
          quantity: 2,
          price: 2500
        }
      ],
      createdAt: "2026-09-18 18:55:28"
    },
    {
      id: 2,
      customerId: 2,
      customer: "Uriel García",
      shippingStreet: "5 de mayo",
      shippingNumber: "231",
      shippingNeighborhood: "Centro",
      shippingCity: "Uriangato",
      shippingState: "Guanajuato",
      shippingPostalCode: "38980",
      total: 2585,
      status: "pagado",
      items: [
        {
          productId: 2,
          nameProduct: "Mouse",
          quantity: 5,
          price: 50
        }
      ],
      createdAt: "2026-09-20 15:55:28"
    }
  ];

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

  it("should return an array of orders", async () => {
    findAllMock.mockResolvedValueOnce(orders);

    await orderController.findAll({} as any, res as any);
    
    expect(findAllMock).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(orders);
  });

  it("should return an order when is called with valid id", async () => {
    findByIdMock.mockResolvedValueOnce(orders[0]);

    await orderController.findById({ params: { id: "1" } } as any, res as any);

    expect(findByIdMock).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(orders[0]);
  });
});
