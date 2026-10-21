export interface IOrderItems {
    productId: number;
    nameProduct: string;
    quantity: number;
    price: number;
}

export interface IOrder {
    id: number;
    customerId: number;
    customer: string;
    shippingStreet: string;
    shippingNumber: string;
    shippingNeighborhood: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    total: number;
    status: string;
    items: IOrderItems[];
    createdAt: string;
}