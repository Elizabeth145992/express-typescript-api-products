import type { AuthRow } from "../types/auth-row.types.js";
import type { IAuth } from "../types/auth.types.js";

export default class AuthMapper {
    toAuth(row: AuthRow): IAuth {
        return {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            phone: row.phone,
            password: row.password_hash,
            active: row.active,
        }
    }
}