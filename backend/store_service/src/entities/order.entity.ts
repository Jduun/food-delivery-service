import { pgTable, uuid, real, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const Order = pgTable("order", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  totalPrice: real("total_price").notNull().default(0),
  address: text("address").notNull(),
  status: text("status").notNull().default("cart"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
