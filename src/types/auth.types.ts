export interface IAuth {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    active: number;
}

export interface IAuthCredentials extends IAuth {
    passwordHash: string;
}

export interface CreateCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
}

export interface ILoginResponse {
    token: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}