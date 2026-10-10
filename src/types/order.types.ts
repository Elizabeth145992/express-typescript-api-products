export interface ICreateOrderItem {
    productId: number;
    quantity: number;
}

export interface IOrderItem {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
}

export interface ICreateOrder {
    customerId: number;
    shippingStreet: string;
    shippingNumber: string;
    shippingNeighborhood: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    items: ICreateOrderItem[];
}