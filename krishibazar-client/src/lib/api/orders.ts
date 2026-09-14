import { apiClient } from "./client";
import type { DashboardOrder } from "@/lib/dashboard/data";

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: DashboardOrder[];
}

export async function getOrders(): Promise<OrdersResponse> {
  return apiClient<OrdersResponse>("/orders");
}
