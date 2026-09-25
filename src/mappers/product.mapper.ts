import type { IProduct } from "../types/product.types.js";
import type { ProductRow } from "../types/product-row.types.js";

class ProductMapper {
    toProduct(row: ProductRow): IProduct {
        return {
            id: row.id,
            name: row.name,
            price: Number(row.price),
            stock: row.stock
        }
    }
}

export default ProductMapper;