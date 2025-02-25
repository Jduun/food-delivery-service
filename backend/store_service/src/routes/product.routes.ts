import { Router } from "express";
import {
  getProductsHandler,
  getAllCategoriesHandler,
  getProductByIdController
} from "../controllers/product.controllers";

const router: Router = Router();

router.get("/", getProductsHandler);
router.get("/categories", getAllCategoriesHandler);
router.get("/:id", getProductByIdController)

export default router;
