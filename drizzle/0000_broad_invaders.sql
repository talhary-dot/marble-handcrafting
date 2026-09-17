CREATE TABLE IF NOT EXISTS "product_sizes" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"size_name" text NOT NULL,
	"dimensions" text NOT NULL,
	"weight" text NOT NULL,
	"price" integer NOT NULL,
	"original_price" integer,
	"stock" integer DEFAULT 10 NOT NULL,
	"sku" text,
	"images" text DEFAULT '[]',
	"is_default" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text,
	"description" text NOT NULL,
	"category" text DEFAULT 'home' NOT NULL,
	"badge" text,
	"stone_type" text NOT NULL,
	"origin" text NOT NULL,
	"finish" text NOT NULL,
	"details" text,
	"care_instructions" text,
	"artisan_story" text,
	"shipping" text,
	"featured_image" text NOT NULL,
	"gallery" text DEFAULT '[]',
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "product_sizes" ADD CONSTRAINT "product_sizes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;