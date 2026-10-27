import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import type {
    IAuth,
    CreateCustomerData,
    IAuthCredentials,
} from "../types/auth.types.js";
import type { IAuthRepository } from "../interfaces/auth.repository.interface.js";
import AuthService from "../services/auth.service.js";
import { createToken } from "../config/jwt.js";

const createCustomerMock =
    jest.fn<(auth: CreateCustomerData) => Promise<number>>();
const findByEmailMock =
    jest.fn<
        (
            email: string,
            isWithCredentials: boolean,
        ) => Promise<IAuth | IAuthCredentials | null>
    >();

function findByEmail(
    email: string,
    isWithCredentials: true,
): Promise<IAuthCredentials | null>;

function findByEmail(
    email: string,
    isWithCredentials: false,
): Promise<IAuth | null>;

function findByEmail(
    email: string,
    isWithCredentials: boolean,
): Promise<IAuth | IAuthCredentials | null> {
    return findByEmailMock(email, isWithCredentials);
}

const mockRepository: IAuthRepository = {
    createCustomer: createCustomerMock,
    findByEmail,
};

const authService = new AuthService(mockRepository);

describe("AuthService", () => {
    let hashSpy: jest.MockedFunction<
        (data: string | Buffer, saltOrRounds: string | number) => Promise<string>
    >;
    let hashCompareSpy: jest.MockedFunction<
        (data: string | Buffer, encrypted: string) => Promise<boolean>
    >;

    beforeEach(() => {
        hashSpy = jest.spyOn(bcrypt, "hash") as unknown as typeof hashSpy;
        hashCompareSpy = jest.spyOn(bcrypt, "compare") as unknown as typeof hashCompareSpy;
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it("should return an user when findByEmail is called", async() => {
        const dataCustomer = {
            id: 1,
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            active: 1,
        };
        findByEmailMock.mockResolvedValueOnce(dataCustomer);
        const user = await authService.findByEmail("emailtest@gmail.com");

        expect(findByEmailMock).toHaveBeenCalledTimes(1);
        expect(user).toEqual(dataCustomer);
    });

    it("should create a new customer with valid data", async () => {
        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            password: "hashtest",
        };

        findByEmailMock.mockResolvedValue(null);
        hashSpy.mockResolvedValue("hash-de-prueba");
        createCustomerMock.mockResolvedValue(1);

        const idCustomer = await authService.createCustomer(dataCustomer);

        expect(createCustomerMock).toHaveBeenCalledTimes(1);
        expect(findByEmailMock).toHaveBeenCalledWith("emailtest@gmail.com", false);
        expect(idCustomer).toBe(1);
        expect(hashSpy).toHaveBeenCalledWith("hashtest", 12);
        expect(createCustomerMock).toHaveBeenCalledWith({
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            passwordHash: "hash-de-prueba"
        });
    });

    it("should throw an error when create is called and the email is already registered", async () => {
        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
        };

        findByEmailMock.mockResolvedValue({ ...dataCustomer, id: 1, active: 1 });

        await expect(authService.createCustomer({ ...dataCustomer, password: "password1" })).rejects.toThrow(
            "El correo que se quiere registrar ya existe"
        );
        expect(hashSpy).not.toHaveBeenCalled();
        expect(createCustomerMock).not.toHaveBeenCalled();
    });

    it("should throw an error when created is called if tne DB is on error", async () => {
        findByEmailMock.mockRejectedValueOnce(new Error("Error de conexión con la base de datos"));

        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            password: "password2",
        };

        await expect(authService.createCustomer(dataCustomer)).rejects.toThrow("Error de conexión con la base de datos");
        expect(hashSpy).not.toHaveBeenCalled();
        expect(createCustomerMock).not.toHaveBeenCalled()
    });

    it("should login with a email and password valid", async () => {
        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            passwordHash: "hash-de-prueba",
        };

        findByEmailMock.mockResolvedValue({ ...dataCustomer, id: 1, active: 1 });
        hashCompareSpy.mockResolvedValue(true);

        const login = await authService.login("emailtest@gmail.com", "passwordTest");

        expect(findByEmailMock).toHaveBeenCalledTimes(1);
        expect(hashCompareSpy).toHaveBeenCalledWith("passwordTest", "hash-de-prueba");
        expect(typeof login.token).toBe("string");
        expect(login.token.length).toBeGreaterThan(0);
        expect(login.user).toEqual({
            id: 1,
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com"
        });
    });

    it("should throw an error if the credentials to login ar incorrects", async () => {
        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            passwordHash: "hash-de-prueba",
        };

        findByEmailMock.mockResolvedValue({ ...dataCustomer, id: 1, active: 1 });
        hashCompareSpy.mockResolvedValue(false);

        await expect(authService.login("emailtest@gmail.com", "123")).rejects.toThrow(
            "Las credenciales proporcionadas no son correctas"
        );
        expect(findByEmailMock).toHaveBeenCalledWith("emailtest@gmail.com", true);
    });

    it("should throw an error if the user not exist when is call login", async() => {
        findByEmailMock.mockResolvedValue(null);

        await expect(authService.login("emailtest@gmail.com", "123")).rejects.toThrow(
            "Las credenciales proporcionadas no son correctas"
        );
        expect(findByEmailMock).toHaveBeenCalledWith("emailtest@gmail.com", true);
        expect(hashCompareSpy).not.toHaveBeenCalled();
    });

    it("should throw an error if the user is inactive when call login", async () => {
        const dataCustomer = {
            firstName: "Elizabeth",
            lastName: "Cruz",
            email: "emailtest@gmail.com",
            phone: "4454623136",
            passwordHash: "hash-de-prueba",
        };

        findByEmailMock.mockResolvedValue({ ...dataCustomer, id: 1, active: 0 });

        await expect(authService.login("emailtest@gmail.com", "123")).rejects.toThrow(
            "Las credenciales proporcionadas no son correctas"
        );
        expect(findByEmailMock).toHaveBeenCalledWith("emailtest@gmail.com", true);
        expect(hashCompareSpy).not.toHaveBeenCalled();
    });
});
