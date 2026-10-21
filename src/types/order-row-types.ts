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
  status_id: number;
  created_at: string;
}

export interface OrderRowComplete extends RowDataPacket {
  id: number;
  customerId: number;
  customer: string;
  shipping_street: string;
  shipping_number: string;
  shipping_neighborhood: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  total: number;
  statusId: number;
  status: string;
  createdAt: string;
  productId: number;
  productName: string;
  price: number;
  qunatity: number;
}
