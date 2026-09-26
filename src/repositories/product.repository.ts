import type { ResultSetHeader } from "mysql2";
import pool from "../database/connection.js";
import type { IProduct } from "../types/product.types.js";
import type { ProductRow } from "../types/product-row.types.js";
import ProductMapper from "../mappers/product.mapper.js";

class ProductRepository {
  private mapper = new ProductMapper();

  async findAll(): Promise<IProduct[]> {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT id, name, price, stock FROM products;",
    );

    return rows.map((row) => this.mapper.toProduct(row));
  }

  async findById(id: number): Promise<IProduct | null> {
    const [rows] = await pool.query<ProductRow[]>(
      "SELECT  id, name, price, stock FROM products WHERE id = ?;",
      [id],
    );

    if (rows.length > 0) {
      return this.mapper.toProduct(rows[0]);
    }
    return null;
  }

  async create(
    name: string,
    price: number,
    stock: number,
  ): Promise<number | null> {
    const [rows] = await pool.query<ResultSetHeader>(
      "INSERT INTO products (name, price, stock) VALUES (?, ?, ?);",
      [name, price, stock],
    );

    if (rows.affectedRows > 0) {
      return rows.insertId;
    }

    return null;
  }

  async update(
    id: number,
    name: string,
    price: number,
    stock: number,
  ): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?;",
      [name, price, stock, id],
    );

    return result.affectedRows > 0;
  }

  async patch(
    id: number,
    name?: string,
    price?: number,
    stock?: number,
  ): Promise<boolean> {
    let parameters: string[] = [];
    let values: (string | number)[] = [];

    if (name !== undefined) {
      parameters.push("name = ?");
      values.push(name);
    }

    if (price !== undefined) {
      parameters.push("price = ?");
      values.push(price);
    }

    if (stock !== undefined) {
      parameters.push("stock = ?");
      values.push(stock);
    }

    values.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products SET ${parameters.join(", ")} WHERE id = ?;`,
      values,
    );

    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?;",
      [id],
    );

    return result.affectedRows > 0;
  }
}

export default ProductRepository;
