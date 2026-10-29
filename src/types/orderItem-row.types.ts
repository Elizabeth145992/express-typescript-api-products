import type { RowDataPacket } from "mysql2";

export interface OrderItemRow extends RowDataPacket {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}