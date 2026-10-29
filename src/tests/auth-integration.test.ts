import { beforeAll, afterAll, beforeEach } from "@jest/globals";
import setupTestDatabase from "../database/setupTestDatabase.js";
import teardownTestDatabase from "../database/teardownTestDatabase.js";
import testPool from "../database/testConnection.js";
import AuthRepository from "../repositories/auth.repository.js";

const authRepository = new AuthRepository(testPool);

beforeAll(async () => {
    await setupTestDatabase();
});

beforeEach( async () => {
    await testPool.query("DELETE FROM customers;")
});

afterAll(async () => {
    await testPool.end();
    await teardownTestDatabase();
});

const user = {
    "firstName": "Ana",
    "lastName": "Zamora",
    "email": "anazmr@gmail.com",
    "phone": "4454879899",
    "passwordHash": "hashTest"
}

describe("AuthRepository", () => {
    it("should create a new user", async () => {
        const customerId = await authRepository.createCustomer(user);

        expect(customerId).toBe(1);
    });

    it("should get user by email without password", async () => {
       const userId = await authRepository.createCustomer(user);

        const newUser = await authRepository.findByEmail("anazmr@gmail.com", false);

        if (newUser === null) {
            throw new Error("Usuario no encontrado");
        }

        expect(newUser.id).toBe(userId);
        expect(newUser.firstName).toBe("Ana");
        expect(newUser.email).toBe("anazmr@gmail.com");
    });

    it("should get user by email with password", async () => {
        const userId = await authRepository.createCustomer(user);
 
         const newUser = await authRepository.findByEmail("anazmr@gmail.com", true);
 
         if (newUser === null) {
             throw new Error("Usuario no encontrado");
         }
 
         expect(newUser.id).toBe(userId);
         expect(newUser.firstName).toBe("Ana");
         expect(newUser.email).toBe("anazmr@gmail.com");
         expect(newUser.passwordHash).toBe("hashTest");
     });

     it("should return null if the email is no register", async () => {
        const newUser = await authRepository.findByEmail("anazmra@gmail.com", false);

        expect(newUser).toBeNull();
     });
});

