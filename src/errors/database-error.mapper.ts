import type { QueryError } from "mysql2";
import AppError from "./AppError.js";

class DataBaseErrorMapper {
    toAppError(error: QueryError): AppError {
        switch (error.code) {
            case "ER_DUP_ENTRY":
                return new AppError("Ya existe un registro con ese valor", 409);
            case "ER_NO_REFERENCED_ROW_2":
                return new AppError("El recurso relacionado no existe", 404);
            case "ER_CHECK_CONSTRAINT_VIOLATED":
                return new AppError("Los datos proporcionados no son válidos", 400);
            default:
                return new AppError("Error interno del servidor", 500);
        }
    }
}

export default DataBaseErrorMapper;