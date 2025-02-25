import { eq, desc, ilike, and, gte, lte, or, sql } from "drizzle-orm";
import { db } from "../db/drizzle.connection";
import { Product } from "../entities/product.entity";
import {
  GetProductParams,
  GetProductsReponse,
  ProductReponse,
  UpdateProductDTO,
} from "@app_types/product.dto";
import logger from "../logger";

export const getProducts = async (
  productParams: GetProductParams,
): Promise<GetProductsReponse> => {
  try {
    const filters = [];
    if (productParams.category !== "") {
      filters.push(eq(Product.category, productParams.category));
    }
    if (productParams.minPrice !== undefined) {
      filters.push(gte(Product.price, productParams.minPrice));
    }
    if (productParams.maxPrice !== undefined) {
      filters.push(lte(Product.price, productParams.maxPrice));
    }
    if (productParams.searchInput !== "") {
      const searchPattern = `%${productParams.searchInput}%`;
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
        createdAt: Product.createdAt,
      })
      .from(Product)
      .where(whereCondition)
      .orderBy(desc(Product.createdAt))
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
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.createdAt.toISOString(),
      })),
      count: count,
    };
  } catch (error: any) {
    logger.error(`Failed to fetch products: ${error.message}`);
    throw new Error(`Failed to fetch products: ${error.message}`);
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
    logger.error(`Failed to fetch categories: ${error.message}`);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const updateProduct = async (
  productId: string,
  updateData: UpdateProductDTO,
): Promise<ProductReponse> => {
  try {
    const updatedProducts = await db
      .update(Product)
      .set({
        ...updateData,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(Product.id, productId))
      .returning();

    const updatedProduct = updatedProducts[0];
    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return {
      ...updatedProduct,
      createdAt: updatedProduct.createdAt.toISOString(),
      updatedAt: updatedProduct.createdAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error updating product: ${error.message}`);
    throw new Error(`Error updating product: ${error.message}`);
  }
};

export const getProductById = async (
  productId: string,
): Promise<ProductReponse> => {
  try {
    const results = await db
      .select({
        id: Product.id,
        name: Product.name,
        count: Product.count,
        category: Product.category,
        price: Product.price,
        image: Product.image,
        description: Product.description,
        createdAt: Product.createdAt,
        updatedAt: Product.updatedAt,
      })
      .from(Product)
      .where(eq(Product.id, productId));

    if (results.length === 0) {
      logger.error("Product not found");
      throw new Error("Product not found");
    }

    const product = results[0];
    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch (error: any) {
    logger.error(`Error fetching product by id: ${error.message}`);
    throw new Error(`Error fetching product by id: ${error.message}`);
  }
};
