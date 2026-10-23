import type { CreateCustomerData, IAuth, IAuthCredentials } from "../types/auth.types.js";

export interface IAuthRepository {
    createCustomer(auth: CreateCustomerData): Promise<number>;
    findByEmail(email: string, isWithCredentials: false): Promise<IAuth | null>;
    findByEmail(email: string, isWithCredentials: true): Promise<IAuthCredentials | null>;
}