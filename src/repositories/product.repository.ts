import type { RowDataPacket } from "mysql2";
import pool from "../database/connection.js";
import type { IProduct } from "../types/product.types.js";

interface ProductRow extends IProduct, RowDataPacket {}

class ProductRepository {
  async findAll(): Promise<IProduct[]> {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT id, name, price, stock FROM products;",
    );

    return rows;
  }

  async findById(id: number): Promise<IProduct | null> {
    const [rows] = await pool.query<ProductRow[]>(
        "SELECT  id, name, price, stock FROM products WHERE id = ?;",
        [id]
    );

    if (rows.length > 0) {
        return rows[0];
    }
    return null;
  }
}

export default ProductRepository;
