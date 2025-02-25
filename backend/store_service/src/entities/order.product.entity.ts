import { pgTable, uuid, integer, real } from "drizzle-orm/pg-core";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

export const OrderProduct = pgTable("order_product", {
  orderId: uuid("order_id")
    .notNull()
    .references(() => Order.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => Product.id),
  count: integer("count").notNull().default(0),
  price: real("price").notNull().default(0),
});
