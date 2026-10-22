export interface IAuth {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    active: number;
}

export interface CreateCustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
  }