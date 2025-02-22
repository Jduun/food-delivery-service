import { pgTable, uuid, integer, numeric } from "drizzle-orm/pg-core";
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
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});
