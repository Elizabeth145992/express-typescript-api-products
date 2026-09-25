import type { IProduct } from "../types/product.types.js";
import ProductRepository from "../repositories/product.repository.js";
import AppError from "../errors/AppError.js";

class ProductService {
  private repository = new ProductRepository();

  async getAll(): Promise<IProduct[]> {
    return this.repository.findAll();
  }

  async getById(id: number): Promise<IProduct> {
    const product = await this.repository.findById(id);

    if (product === null) {
      throw new AppError("Producto no encontrado", 404);
    }

    return product;
  }

  async create(name: string, price: number, stock: number): Promise<IProduct> {
    const newProducId = await this.repository.create(name, price, stock);

    if (newProducId === null) {
      throw new AppError("No se pudo crear el producto", 500);
    }

    const newProduct = await this.repository.findById(newProducId);

    if (newProduct === null) {
      throw new AppError("Producto creado pero no encontrado", 500);
    }

    return newProduct;
  }

  async update(id: number, name: string, price: number, stock: number): Promise<IProduct> {
    const isUpdated = await this.repository.update(id, name, price, stock);

    if (!isUpdated) {
      throw new AppError("Producto no actualizado con el id: " + id, 404);
    }

    const product = await this.repository.findById(id);

    if (product === null) {
      throw new AppError("Producto actualizado, pero no encontrado", 500);
    }
    return product;
  }

  async patch(
    id: number,
    name: string | undefined,
    price: number | undefined,
    stock: number | undefined,
  ): Promise<IProduct> {
    const isUpdated = await this.repository.patch(id, name, price, stock);

    if (!isUpdated) {
      throw new AppError("Producto no actualizado con el id " + id, 404);
    }

    const product = await this.repository.findById(id);

    if (product === null) {
      throw new AppError("Producto actualizdo pero no encontrado", 500);
    }

    return product;
  }

  async delete(id: number):Promise<void> {
    const isDeleted = await this.repository.delete(id);

    if (!isDeleted) {
      throw new AppError("El producto no fue eliminado", 404);
    }
  }
}

export default ProductService;
