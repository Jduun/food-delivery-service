CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"address" text NOT NULL,
	"status" text DEFAULT 'cart' NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_product" (
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"image" text,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_product" ADD CONSTRAINT "order_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;