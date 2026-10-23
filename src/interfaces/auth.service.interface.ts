import type { RegisterDTO } from "../schemas/auth.schema.js";
import type { IAuth, ILoginResponse } from "../types/auth.types.js";

export interface IAuthService {
    createCustomer(auth: RegisterDTO): Promise<number>;
    findByEmail(email: string): Promise<IAuth | null>;
    login(email: string, password: string): Promise<ILoginResponse>;
}