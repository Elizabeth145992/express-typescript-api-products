import type { Pool, ResultSetHeader } from "mysql2/promise";
import type { IAuth, CreateCustomerData, IAuthCredentials } from "../types/auth.types.js";
import type { AuthRow } from "../types/auth-row.types.js";
import AuthMapper from "../mappers/auth.mapper.js";
import type { IAuthRepository } from "../interfaces/auth.repository.interface.js";

export default class AuthRepository implements IAuthRepository {
    private pool: Pool;
    private mapper = new AuthMapper;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async createCustomer(auth: CreateCustomerData): Promise<number> {
        const [row] = await this.pool.execute<ResultSetHeader>(`
            INSERT INTO 
                customers (first_name, last_name, email, phone, password_hash)
                VALUES (?, ?, ?, ?, ?);`,
            [auth.firstName, auth.lastName, auth.email, auth.phone, auth.passwordHash]
        );

        return row.insertId;
    }

    async findByEmail(email: string, isWithCredentials: false): Promise<IAuth | null>;
    async findByEmail(email: string, isWithCredentials: true): Promise<IAuthCredentials | null>;
    async findByEmail(
        email: string,
        isWithCredentials: boolean,
    ): Promise<IAuth | IAuthCredentials | null> {
        const [result] = await this.pool.execute<AuthRow[]>(`
            SELECT id, first_name, last_name, email, phone, password_hash, active 
                FROM customers 
                WHERE email = ? LIMIT 1;`,
            [email]
        );

        if (result.length > 0) {
            return isWithCredentials
                ? this.mapper.toAuthCredentials(result[0])
                : this.mapper.toAuth(result[0]);
        }

        return null;
    }
}