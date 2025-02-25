import { Request, Response } from "express";
import { getProducts, getAllCategories, getProductById } from "../services/product.service";
import { GetProductParams } from "@app_types/product.dto";

export const getProductsHandler = async (req: Request, res: Response) => {
  try {
    const productParams: GetProductParams = {
      searchInput: (req.query.searchInput as string) || "",
      offset: parseInt(req.query.offset as string) || 0,
      limit: parseInt(req.query.limit as string) || 10,
      category: (req.query.category as string) || "",
      minPrice: parseInt(req.query.minPrice as string) || 0,
      maxPrice: parseInt(req.query.maxPrice as string) || undefined,
    };
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

export const getProductByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};