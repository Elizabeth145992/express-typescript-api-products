import type { RowDataPacket } from "mysql2";


export interface OrderRow extends RowDataPacket {
    id: number;
    customer_id: number;
    shipping_street: string;
    shipping_number: string;
    shipping_neighborhood: string;
    shipping_city: string;
    shipping_state: string;
    shipping_postal_code: string;
    total: number;
    status_id: number
    created_at: string;
}