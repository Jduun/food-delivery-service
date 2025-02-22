export interface GetProductParams {
  search_input: string;
	offset: number;
	limit: number;
	category: string;
	min_price: number;
	max_price: number | undefined;
}

export interface ProductReponse {
	id: string;
	name: string;
	count: number;
	category: string;
	price: number;
	image: string | null;
	description: string | null;
	created_at: string;
}
