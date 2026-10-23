import bcrypt from "bcrypt";
import AppError from "../errors/AppError.js";
import type { IAuthRepository } from "../interfaces/auth.repository.interface.js";
import type {
  IAuth,
  IAuthCredentials,
  ILoginResponse,
} from "../types/auth.types.js";
import type { RegisterDTO } from "../schemas/auth.schema.js";
import { createToken } from "../config/jwt.js";

export default class AuthService {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  async createCustomer(auth: RegisterDTO): Promise<number> {
    const existingCustomer = await this.repository.findByEmail(
      auth.email,
      false,
    );

    if (existingCustomer !== null) {
      throw new AppError("El correo que se quiere registrar ya existe", 409);
    }

    const passwordHash = await bcrypt.hash(auth.password, 12);
    return await this.repository.createCustomer({ ...auth, passwordHash });
  }

  async findByEmail(email: string): Promise<IAuth | null> {
    return this.repository.findByEmail(email, false);
  }

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.repository.findByEmail(email, true);

    if (user === null || !user.active) {
      throw new AppError(
        "Las credenciales proporcionadas no son correctas",
        401,
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      throw new AppError(
        "Las credenciales proporcionadas no son correctas",
        401,
      );
    }

    const token = createToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }
}
