export interface GetProductParams {
  searchInput: string;
  offset: number;
  limit: number;
  category: string;
  minPrice: number;
  maxPrice: number | undefined;
}

export interface ProductReponse {
  id: string;
  name: string;
  count: number;
  category: string;
  price: number;
  image: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsReponse {
  products: ProductReponse[];
  count: number;
}

export interface UpdateProductDTO {
  name?: string;
  count?: number;
  category?: string;
  price?: number;
  image?: string;
  description?: string;
}