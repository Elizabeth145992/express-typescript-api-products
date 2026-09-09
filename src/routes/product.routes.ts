import express from "express";
import { validateProduct } from "../middlewares/validateProduct.js";
import { validatePatchProduct } from "../middlewares/validatePatchProduct.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.patch("/:id", validatePatchProduct, patchProduct);
router.delete("/:id", deleteProduct);

export default router;
