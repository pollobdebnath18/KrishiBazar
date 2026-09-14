import { apiClient } from "./client";
import type { Product, ProductResponse } from "@/types/product";

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  location?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  location: string;
  category: string;
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category && filters.category !== "all")
    params.set("category", filters.category);
  if (filters.location && filters.location !== "all")
    params.set("location", filters.location);

  const queryString = params.toString();
  return apiClient(queryString ? `/products?${queryString}` : "/products");
}

export async function getProduct(id: string): Promise<ProductDetailResponse> {
  return apiClient(`/products/${encodeURIComponent(id)}`);
}

export async function createProduct(
  input: CreateProductInput,
): Promise<CreateProductResponse> {
  return apiClient("/products", {
    method: "POST",
    body: JSON.stringify(input),
  }) as Promise<CreateProductResponse>;
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput> & { featured?: boolean },
): Promise<ProductDetailResponse> {
  return apiClient(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await apiClient("/products/featured");
  return response.data as Product[];
}
