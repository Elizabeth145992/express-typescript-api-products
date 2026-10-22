import type { CreateCustomerData, IAuth } from "../types/auth.types.js";

export interface IAuthRepository {
    createCustomer(auth: CreateCustomerData): Promise<number>,
    findByEmail(email: string): Promise<IAuth | null>
}