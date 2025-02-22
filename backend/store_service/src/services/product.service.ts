import { eq, desc, ilike, and, gte, lte, or, sql } from "drizzle-orm";
import { db } from "../db/drizzle.connection";
import { Product } from "../entities/product.entity";
import {
  ProductReponse,
  GetProductParams,
  GetProductsReponse,
} from "@app_types/product.dto";

export const getProducts = async (
  productParams: GetProductParams,
): Promise<GetProductsReponse> => {
  try {
    const filters = [];
    if (productParams.category !== "") {
      filters.push(eq(Product.category, productParams.category));
    }
    if (productParams.min_price !== undefined) {
      filters.push(gte(Product.price, productParams.min_price));
    }
    if (productParams.max_price !== undefined) {
      filters.push(lte(Product.price, productParams.max_price));
    }
    if (productParams.search_input !== "") {
      const searchPattern = `%${productParams.search_input}%`;
      filters.push(
        or(
          ilike(Product.name, searchPattern),
          ilike(Product.description, searchPattern),
          ilike(Product.category, searchPattern),
        ),
      );
    }
    const whereCondition = filters.length > 0 ? and(...filters) : undefined;
    const products = await db
      .select({
        id: Product.id,
        name: Product.name,
        count: Product.count,
        category: Product.category,
        price: Product.price,
        image: Product.image,
        description: Product.description,
        created_at: Product.created_at,
      })
      .from(Product)
      .where(whereCondition)
      .orderBy(desc(Product.created_at))
      .offset(productParams.offset)
      .limit(productParams.limit);

    const countResult = await db
      .select({ total: sql<number>`COUNT(*)` })
      .from(Product)
      .where(whereCondition);
    const count = countResult[0]?.total || 0;

    return {
      products: products.map((product) => ({
        ...product,
        created_at: product.created_at.toISOString(),
      })),
      count: count,
    };
  } catch (error: any) {
    throw new Error("Failed to fetch products: " + error.message);
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    const result = await db
      .select({ category: Product.category })
      .from(Product)
      .groupBy(Product.category)
      .orderBy(Product.category);
    return result.map((row) => row.category);
  } catch (error: any) {
    throw new Error("Failed to fetch categories: " + error.message);
  }
};
