import express from "express";
import { validateProduct } from "../middlewares/validateProduct.js";
import { validatePatchProduct } from "../middlewares/validatePatchProduct.js";
import { createProductController } from "../controllers/product.controller.js";
import ProductRepository from "../repositories/product.repository.js";
import ProductService from "../services/product.service.js";

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);

const router = express.Router();
const productController = createProductController(productService);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post("/", validateProduct, productController.createProduct);
router.put("/:id", validateProduct, productController.updateProduct);
router.patch("/:id", validatePatchProduct, productController.patchProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
