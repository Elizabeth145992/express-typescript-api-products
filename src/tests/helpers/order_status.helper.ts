import testPool from "../../database/testConnection.js";

export async function insertStatusOrder(): Promise<void> {
  await testPool.execute(
    "INSERT INTO order_statuses (name) VALUES (?), (?), (?), (?);",
    ["pendiente", "pagado", "enviado", "cancelado"],
  );
}
