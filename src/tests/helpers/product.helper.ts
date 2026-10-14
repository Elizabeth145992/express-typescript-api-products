import type { ResultSetHeader } from "mysql2/promise";
import testPool from "../../database/testConnection.js";
import { makeFakeProductProps } from "../fixtures/product.fixtures.js";

export async function createTestProduct(
  overrides: Partial<{
    name: string;
    price: number;
    stock: number;
  }> = {},
): Promise<number> {
  const product = makeFakeProductProps(overrides);

  const [result] = await testPool.execute<ResultSetHeader>(
    `INSERT INTO products (name, price, stock)
     VALUES (?, ?, ?)`,
    [product.name, product.price, product.stock],
  );

  return result.insertId;
}