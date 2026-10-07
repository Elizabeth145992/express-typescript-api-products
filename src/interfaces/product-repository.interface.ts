import type { IProduct } from "../types/product.types.js";

export interface IProductRepository {
    findById(id: number): Promise<IProduct | null>;
    findAll(): Promise<IProduct[]>;
    create(name: string, price: number, stock: number): Promise<number | null>;
    update(
        id: number,
        name: string,
        price: number,
        stock: number,
    ): Promise<boolean>;
    patch(
        id: number,
        name?: string,
        price?: number,
        stock?: number,
    ): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
