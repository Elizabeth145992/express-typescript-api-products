import type { IProduct } from "../types/product.types.js";

class ProductService {
  private products: IProduct[] = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Smartphone", price: 800 },
  ];
  
  private nextProductId = 3;

  getAll(): IProduct[] {
    return this.products;
  }

  getById(id: number): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  create(name: string, price: number): IProduct {
    const newProduct: IProduct = {
        id: this.nextProductId,
        name,
        price
    }

    this.products.push(newProduct);
    this.nextProductId ++;

    return newProduct;
  }

  update(id: number, name: string, price: number): IProduct | undefined {
    const indexProduct = this.products.findIndex((p) => p.id === id);

    if (indexProduct === -1) {
        return undefined;
    }

    this.products[indexProduct] = {
        ...this.products[indexProduct],
        name,
        price,
    }

    return this.products[indexProduct];
  }

  patch(id: number, name: string | undefined, price: number | undefined): IProduct | undefined {
    const indexProduct = this.products.findIndex((p) => p.id === id);

    if (indexProduct === -1) {
        return undefined;
    }

    if (name !== undefined) {
        this.products[indexProduct].name = name;
    }

    if (price !== undefined) {
        this.products[indexProduct].price = price;
    }
    return this.products[indexProduct];
  }

  delete(id: number): boolean {
    const indexProduct = this.products.findIndex((p) => p.id === id);

    if (indexProduct === -1) {
        return false;
    }

    this.products.splice(indexProduct, 1);
    return true;
  }
}

export default ProductService;
