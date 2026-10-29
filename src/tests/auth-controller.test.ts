import { jest } from "@jest/globals";
import type { RegisterDTO } from "../schemas/auth.schema.js";
import type { IAuth, ILoginResponse } from "../types/auth.types.js";
import type { IAuthService } from "../interfaces/auth.service.interface.js";
import { createAuthController } from '../controllers/auth.controller.js'

const jsonMock = jest.fn();
const res = {
    json: jsonMock
}

const createCustomerMock = jest.fn<(auth: RegisterDTO) => Promise<number>>();
const findByEmailMock = jest.fn<(email: string) => Promise<IAuth | null>>();
const loginMock = jest.fn<(email: string, password: string) => Promise<ILoginResponse>>();

const mockAuthService: IAuthService = {
    createCustomer: createCustomerMock,
    findByEmail: findByEmailMock,
    login: loginMock,
}

const authController = createAuthController(mockAuthService);

describe("AuthController", () => {
    const body = {
        "firstName": "Ana",
        "lastName": "Zamora",
        "email": "anazmr@gmail.com",
        "phone": "4454879899",
        "password": "hola1234"
    }

    it("should create a new user when is called createCustomer with a valid data", async () => {
        createCustomerMock.mockResolvedValue(1);

        const req = {
            body
        }
        const statusMock = jest.fn().mockReturnThis();
        const restNewUser = {
            status: statusMock,
            json: jsonMock
        }

        await authController.createCustomer(req as any, restNewUser as any);

        expect(createCustomerMock).toHaveBeenCalledWith(body);
        expect(statusMock).toHaveBeenLastCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({ id: 1 });
    });

    it("should throw an error when email is already register", async () => {
        const error = new Error("El correo que se quiere registrar ya existe");
        createCustomerMock.mockRejectedValueOnce(error);

        await expect(
            authController.createCustomer(
                { body } as any,
                { status: jest.fn(), json: jsonMock } as any
            ),
        ).rejects.toThrow("El correo que se quiere registrar ya existe");
    });

    it("should login correct with a valid data", async () => {
        const userLogin = {
            token: "tokenTest",
            user: {
                id: 1,
                firstName: "Ana",
                lastName: "Sosa",
                email: "ana_sosa@gmail.com",
            }
        }
        loginMock.mockResolvedValue(userLogin);
        const body = {
            email: "ana_sosa@gmail.com",
            password: "12345678"
        }
        const req = { body }
        const statusMock = jest.fn().mockReturnThis();
        const restLogin = {
            status: statusMock,
            json: jsonMock
        }

        await authController.login(req as any, restLogin as any);

        expect(loginMock).toHaveBeenCalledWith("ana_sosa@gmail.com", "12345678");
        expect(statusMock).toHaveBeenLastCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(userLogin);
    });

    it("should throw an error when credentials are incorrect", async () => {
        const error = new Error("Las credenciales proporcionadas no son correctas");
        loginMock.mockRejectedValueOnce(error);

        const body = {
            email: "ana_sosa@gmail.com",
            password: "12345678"
        }

        await expect(
            authController.login(
                { body } as any,
                { status: jest.fn(), json: jsonMock } as any
            ),
        ).rejects.toThrow("Las credenciales proporcionadas no son correctas");
    });
});