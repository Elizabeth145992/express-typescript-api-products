import type { QueryError } from "mysql2";

export function isMysqlError(error: unknown): error is QueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}
