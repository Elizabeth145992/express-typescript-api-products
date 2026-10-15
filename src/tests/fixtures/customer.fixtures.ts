import { randomUUID } from "node:crypto";

export function makeFakeCustomerProps() {
  const uniqueId = randomUUID();

  return {
    firstName: "Cliente",
    lastName: "Prueba",
    email: `cliente-${uniqueId}@example.com`,
    phone: "4611234567",
    passwordHash: "test-password-hash",
    active: true,
  };
}