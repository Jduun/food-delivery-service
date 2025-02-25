import { Request, Response } from "express";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  createOrderProduct,
  getOrderProductByIds,
  updateOrderProduct,
  getOrderById,
  deleteOrderProduct,
  doesOrderExistForUser,
  getOrderProducts,
} from "../services/order.service";
import { updateProduct, getProductById } from "../services/product.service";
import { GetOrderParams, CreateOrderDTO } from "@app_types/order.dto";

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orderParams: GetOrderParams = {
      userId: user.id,
      offset: parseInt(req.query.offset as string) || 0,
      limit: parseInt(req.query.limit as string) || 10,
    };
    const orders = await getOrders(orderParams);
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orderValues: CreateOrderDTO = {
      userId: user.id,
      address: (req.query.address as string) || "",
    };
    const order = await createOrder(orderValues);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.id;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const order = await updateOrder(orderId, {
      status: "confirmed",
    });
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to confirm order" });
  }
};

export const deleteOrderController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.id;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const order = await deleteOrder(orderId);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

export const addProductInCartController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.orderId;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const productId = req.params.productId;
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    if (order.status !== "cart") {
      res.status(400).json({ message: "Order status is not cart." });
      return;
    }
    if (product.count <= 0) {
      res.status(500).json({ message: "Product count is no more than 0" });
      return;
    }
    let orderProduct;
    try {
      orderProduct = await getOrderProductByIds(orderId, productId);
    } catch (error: any) {
      orderProduct = await createOrderProduct(orderId, productId);
    }
    const newCount = orderProduct.count + 1;
    orderProduct = await updateOrderProduct(orderId, productId, {
      count: newCount,
      price: product.price * newCount,
    });

    await updateOrder(orderId, {
      totalPrice: order.totalPrice + product.price,
    });
    await updateProduct(productId, { count: product.count - 1 });
    res.status(200).json(orderProduct);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to add product in cart" });
  }
};

export const removeProductFromCartController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.orderId;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const productId = req.params.productId;
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }
    if (order.status !== "cart") {
      res.status(400).json({ message: "Order status is not cart." });
      return;
    }
    let orderProduct = await getOrderProductByIds(orderId, productId);
    if (!orderProduct) {
      res.status(404).json({ message: "Product not found in cart." });
      return;
    }

    const newCount = orderProduct.count - 1;
    if (newCount > 0) {
      orderProduct = await updateOrderProduct(orderId, productId, {
        count: newCount,
        price: product.price * newCount,
      });
    } else {
      await deleteOrderProduct(orderId, productId);
    }
    await updateOrder(orderId, {
      totalPrice: order.totalPrice - product.price,
    });
    await updateProduct(productId, { count: product.count + 1 });
    res.status(200).json(orderProduct);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

export const getOrderProductsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.orderId;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const products = await getOrderProducts(orderId);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch orderProducts." });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const orderId = req.params.id;
    const orderForUserExits = await doesOrderExistForUser(orderId, user.id);
    if (!orderForUserExits) {
      res.status(400).json({ message: "Order doesn't belong that user" });
      return;
    }
    const order = await getOrderById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};
