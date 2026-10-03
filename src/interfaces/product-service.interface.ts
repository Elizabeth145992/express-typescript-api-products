import type { IProduct } from "../types/product.types.js";

export interface IProductService {
  getAll(): Promise<IProduct[]>;
  getById(id: number): Promise<IProduct>;
  create(name: string, price: number, stock: number): Promise<IProduct>;
  update(
    id: number,
    name: string,
    price: number,
    stock: number,
  ): Promise<IProduct>;
  patch(
    id: number,
    name: string | undefined,
    price: number | undefined,
    stock: number | undefined,
  ): Promise<IProduct>;
  delete(id: number): Promise<void>;
}
