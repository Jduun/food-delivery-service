import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const Product = pgTable("product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  count: integer("count").notNull().default(0),
  category: text("category").notNull(),
  price: real("price").notNull().default(0),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
