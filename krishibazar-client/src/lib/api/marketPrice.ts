import { apiClient } from "./client";
import type { MarketPriceResponse } from "@/types/marketPrice";

export interface MarketPriceFilters {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

export interface CreateMarketPriceInput {
  title: string;
  description?: string;
  image: string;
  location: string;
  category: string;
  price: number;
  previousPrice?: number | null;
  priceStatus: string;
  quantity: number;
  unit: string;
}

export async function createMarketPrice(
  input: CreateMarketPriceInput
): Promise<MarketPriceResponse> {
  return apiClient("/marketPrice", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMarketPrices(
  filters: MarketPriceFilters = {}
): Promise<MarketPriceResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category && filters.category !== "all")
    params.set("category", filters.category);
  if (filters.location && filters.location !== "all")
    params.set("location", filters.location);
  if (filters.status && filters.status !== "all")
    params.set("status", filters.status);

  const queryString = params.toString();
  return apiClient(queryString ? `/marketPrice?${queryString}` : "/marketPrice");
}

export async function updateMarketPrice(
  id: string,
  input: Partial<CreateMarketPriceInput>
): Promise<MarketPriceResponse> {
  return apiClient(`/marketPrice/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteMarketPrice(
  id: string
): Promise<MarketPriceResponse> {
  return apiClient(`/marketPrice/${id}`, {
    method: "DELETE",
  });
}