import { Router } from "express";
import {
  getOrdersController,
  createOrderController,
  confirmOrder,
  deleteOrderController,
  addProductInCartController,
  removeProductFromCartController,
  getOrderProductsController,
  getOrderByIdController,
} from "../controllers/order.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", authMiddleware, getOrdersController);
router.get("/:id", authMiddleware, getOrderByIdController);
router.post("/", authMiddleware, createOrderController);
router.delete("/:id", authMiddleware, deleteOrderController);
router.post("/:id/confirm", authMiddleware, confirmOrder);
router.get("/:orderId/products", authMiddleware, getOrderProductsController);
router.post(
  "/:orderId/products/:productId",
  authMiddleware,
  addProductInCartController,
);
router.delete(
  "/:orderId/products/:productId",
  authMiddleware,
  removeProductFromCartController,
);

export default router;
