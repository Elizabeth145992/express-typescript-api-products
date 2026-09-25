import type { RowDataPacket } from "mysql2";

export interface ProductRow extends RowDataPacket {
  id: number;
  name: string;
  price: string;
  stock: number;
}