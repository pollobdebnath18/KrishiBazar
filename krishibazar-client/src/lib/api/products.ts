import { apiClient } from "./client";

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  location: string;
  category: string;
  farmerId: string;
}

export async function createProduct(
  input: CreateProductInput
): Promise<{ success: boolean; message: string; data: unknown }> {
  return apiClient("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}