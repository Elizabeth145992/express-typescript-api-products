export interface IProduct {
  id: number;
  name: string;
  price: number;
}

export interface ICreateProduct {
  name: string;
  price: number;
}

export interface IUpdateProduct {
  name?: string;
  price?: number;
}