import { and, eq, desc, sql } from "drizzle-orm";
import { db } from "../db/drizzle.connection";
import { Order } from "../entities/order.entity";
import { OrderProduct } from "../entities/order.product.entity";
import { Product } from "../entities/product.entity";
import {
  GetOrderResponse,
  GetOrderParams,
  CreateOrderDTO,
  OrderResponse,
  OrderProductResponse,
  UpdateOrderProductDTO,
} from "@app_types/order.dto";
import logger from "../logger";
import { userInfo } from "os";

export const getOrders = async (
  orderParams: GetOrderParams,
): Promise<GetOrderResponse> => {
  try {
    const orders = await db
      .select({
        id: Order.id,
        userId: Order.userId,
        totalPrice: Order.totalPrice,
        address: Order.address,
        status: Order.status,
        createdAt: Order.createdAt,
        updatedAt: Order.updatedAt,
      })
      .from(Order)
      .where(eq(Order.userId, orderParams.userId))
      .orderBy(desc(Order.createdAt))
      .offset(orderParams.offset)
      .limit(orderParams.limit);

    const countResult = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(Order);
    const count = countResult[0]?.total || 0;

    return {
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
      count: count,
    };
  } catch (error: any) {
    logger.error(`Failed to fetch orders: ${error.message}`);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};

export const createOrder = async (
  orderData: CreateOrderDTO,
): Promise<OrderResponse> => {
  try {
    const newOrder: typeof Order.$inferInsert = {
      userId: orderData.userId,
      address: orderData.address,
    };
    const insertedOrders = await db.insert(Order).values(newOrder).returning();
    const insertedOrder = insertedOrders[0];
    return {
      ...insertedOrder,
      createdAt: insertedOrder.createdAt.toISOString(),
      updatedAt: insertedOrder.updatedAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error creating order: ${error.message}`);
    throw new Error(`Error creating order: ${error.message}`);
  }
};

export const updateOrder = async (
  orderId: string,
  updateData: Partial<Pick<typeof Order.$inferInsert, "totalPrice" | "status">>,
): Promise<OrderResponse> => {
  try {
    const updatedOrders = await db
      .update(Order)
      .set({
        ...updateData,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(Order.id, orderId))
      .returning();
    const updatedOrder = updatedOrders[0];
    return {
      ...updatedOrder,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error updating order: ${error.message}`);
    throw new Error(`Error updating order: ${error.message}`);
  }
};

export const deleteOrder = async (orderId: string): Promise<OrderResponse> => {
  try {
    const deletedOrders = await db
      .delete(Order)
      .where(eq(Order.id, orderId))
      .returning();

    const deletedOrder = deletedOrders[0];
    if (!deletedOrder) {
      logger.error("Order not found");
      throw new Error("Order not found");
    }
    return {
      ...deletedOrder,
      createdAt: deletedOrder.createdAt.toISOString(),
      updatedAt: deletedOrder.updatedAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error deleting order: ${error.message}`);
    throw new Error(`Error deleting order: ${error.message}`);
  }
};

export const createOrderProduct = async (
  orderId: string,
  productId: string,
): Promise<OrderProductResponse> => {
  try {
    const orderProductValues: typeof OrderProduct.$inferInsert = {
      orderId: orderId,
      productId: productId,
    };
    const insertedOrderProducts = await db
      .insert(OrderProduct)
      .values(orderProductValues)
      .returning();
    const insertedOrderProduct = insertedOrderProducts[0];
    return insertedOrderProduct;
  } catch (error: any) {
    logger.error(`Error creating orderProduct: ${error.message}`);
    throw new Error(`Error creating orderProduct: ${error.message}`);
  }
};

export const deleteOrderProduct = async (
  orderId: string,
  productId: string,
): Promise<OrderProductResponse> => {
  try {
    const deletedOrderProducts = await db
      .delete(OrderProduct)
      .where(
        and(
          eq(OrderProduct.productId, productId),
          eq(OrderProduct.orderId, orderId),
        ),
      )
      .returning();
    const deletedOrderProduct = deletedOrderProducts[0];
    return deletedOrderProduct;
  } catch (error: any) {
    logger.error(`Error deleting orderProduct: ${error.message}`);
    throw new Error(`Error deleting orderProduct: ${error.message}`);
  }
};

export const updateOrderProduct = async (
  orderId: string,
  productId: string,
  updateData: UpdateOrderProductDTO,
): Promise<OrderProductResponse> => {
  try {
    const updatedOrderProducts = await db
      .update(OrderProduct)
      .set(updateData)
      .where(
        and(
          eq(OrderProduct.productId, productId),
          eq(OrderProduct.orderId, orderId),
        ),
      )
      .returning();
    const updatedOrderProduct = updatedOrderProducts[0];
    if (!updatedOrderProduct) {
      logger.error("OrderProduct not found");
      throw new Error("OrderProduct not found");
    }
    return updatedOrderProduct;
  } catch (error: any) {
    logger.error(`Error updating orderProduct: ${error.message}`);
    throw new Error(`Error updating orderProduct: ${error.message}`);
  }
};

export const getOrderProductByIds = async (
  orderId: string,
  productId: string,
): Promise<OrderProductResponse> => {
  try {
    const results = await db
      .select()
      .from(OrderProduct)
      .where(
        and(
          eq(OrderProduct.orderId, orderId),
          eq(OrderProduct.productId, productId),
        ),
      );
    if (results.length === 0) {
      logger.error("OrderProduct not found");
      throw new Error("OrderProduct not found");
    }
    return results[0];
  } catch (error: any) {
    logger.error(`Error fetching orderProduct: ${error.message}`);
    throw new Error(`Error fetching orderProduct: ${error.message}`);
  }
};

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const results = await db
      .select({
        id: Order.id,
        userId: Order.userId,
        totalPrice: Order.totalPrice,
        address: Order.address,
        status: Order.status,
        createdAt: Order.createdAt,
        updatedAt: Order.updatedAt,
      })
      .from(Order)
      .where(eq(Order.id, orderId));
    if (results.length === 0) {
      logger.error("Order not found");
      throw new Error("Order not found");
    }
    const order = results[0];
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error fetching order by id: ${error.message}`);
    throw new Error(`Error fetching order by id: ${error.message}`);
  }
};

export const doesOrderExistForUser = async (
  orderId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const results = await db
      .select({
        id: Order.id,
        userId: Order.userId,
      })
      .from(Order)
      .where(and(eq(Order.id, orderId), eq(Order.userId, userId)));
    return results.length > 0;
  } catch (error: any) {
    logger.error(`Error checking order existence: ${error.message}`);
    return false;
  }
};

export const getOrderProducts = async (
  orderId: string,
): Promise<OrderProductResponse[]> => {
  try {
    const results = await db
      .select()
      .from(OrderProduct)
      .where(eq(OrderProduct.orderId, orderId));
    return results;
  } catch (error: any) {
    logger.error(`Error fetching orderProduct: ${error.message}`);
    throw new Error(`Error fetching orderProduct: ${error.message}`);
  }
};
