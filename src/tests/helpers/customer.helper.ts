import testPool from "../../database/testConnection.js";
import { makeFakeCustomerProps } from "../fixtures/customer.fixtures.js";

export async function createTestCustomer(): Promise<number> {
  const customer = makeFakeCustomerProps();

  const [result] = await testPool.execute(
    `INSERT INTO customers
      (first_name, last_name, email, phone, password_hash, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      customer.firstName,
      customer.lastName,
      customer.email,
      customer.phone,
      customer.passwordHash,
      customer.active,
    ],
  );

  return (result as { insertId: number }).insertId;
}