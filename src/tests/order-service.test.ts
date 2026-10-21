import { jest } from "@jest/globals";
import OrderService from "../services/order.service.js";
import type { IOrderRepository } from "../interfaces/order-repository.interface.js";
import type { ICreateOrderInput } from "../schemas/order.schema.js";
import type { IOrder } from "../types/order.types.js";

const createOrderMock = jest.fn<
  (order: ICreateOrderInput) => Promise<number>
>();
const findAllMock = jest.fn<() => Promise<IOrder[] | []>>();
const findByIdMock = jest.fn<(id: number) => Promise<IOrder | null>>();

const mockRepository: IOrderRepository = {
  createOrder: createOrderMock,
  findAll: findAllMock,
  findById: findByIdMock
};

const orderService = new OrderService(mockRepository);

describe("OrderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("should return orders array", async () => {
    findAllMock.mockResolvedValueOnce(orders);

    const resultOrders = await orderService.findAll();

    expect(findAllMock).toHaveBeenCalledTimes(1);
    expect(resultOrders).toEqual(orders);
  });

  it("should return an empty arry if there is not orders", async () => {
    findAllMock.mockResolvedValueOnce([]);

    const resultOrders = await orderService.findAll();

    expect(findAllMock).toHaveBeenCalledTimes(1);
    expect(resultOrders).toEqual([]);
  });

  it("should return a order when it is called to get it", async () => {
    findByIdMock.mockResolvedValueOnce(orders[0]);

    const orderResult = await orderService.findById(1);

    expect(findByIdMock).toHaveBeenCalledWith(1);
    expect(orderResult).toEqual(orders[0]);
  });

  it("should throw an error when the order not exist", async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(orderService.findById(1)).rejects.toThrow(
      "La orden no fue encontrada"
    );
  });
});
