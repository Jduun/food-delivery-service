import { Router } from "express";
import {
  getProductsHandler,
  getAllCategoriesHandler,
} from "../controllers/product.controller";

const router: Router = Router();

router.get("/products", getProductsHandler);
router.get("/products/categories", getAllCategoriesHandler);

export default router;
