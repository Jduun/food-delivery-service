import { pgTable, uuid, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const Order = pgTable("order", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  address: text("address").notNull(),
  status: text("status").notNull().default("cart"),
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
});
