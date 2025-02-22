import { Request, Response } from "express";
import { getProducts, getAllCategories } from "../services/product.service";
import { GetProductParams } from "@app_types/product.dto";
import logger from "../logger";

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const productParams: GetProductParams = {
      search_input: (req.query.search_input as string) || "",
      offset: parseInt(req.query.offset as string) || 0,
      limit: parseInt(req.query.limit as string) || 10,
      category: (req.query.limit as string) || "",
      min_price: parseInt(req.query.min_price as string) || 0,
      max_price: parseInt(req.query.max_price as string) || undefined,
    };
    logger.info(`offset:${productParams.offset}, limit:${productParams.limit}`);
    const products = await getProducts(productParams);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
