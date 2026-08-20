export type PriceStatus = "increased" | "decreased" | "stable";

export interface MarketPrice {
  id: string;
  title: string;
  description: string | null;
  image: string;
  location: string;
  category: string;
  price: number;
  previousPrice: number | null;
  priceStatus: string;
  quantity: number;
  unit: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketPriceResponse {
  success: boolean;
  message: string;
  data: MarketPrice[];
}
