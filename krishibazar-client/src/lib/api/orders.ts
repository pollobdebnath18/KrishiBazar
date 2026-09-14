import { apiClient } from "./client";
import type { CartLine, DashboardOrder } from "@/lib/dashboard/data";

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: DashboardOrder[];
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: DashboardOrder;
}

export interface CheckoutPayload {
  cart: CartLine[];
  customer?: string;
  farmer?: string;
  payment?: string;
  paymentMethod?: "BKASH" | "CARD";
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId?: string;
    checkoutUrl?: string;
    order?: DashboardOrder;
    paymentMode?: string;
  };
}

export async function getOrders(): Promise<OrdersResponse> {
  return apiClient<OrdersResponse>("/orders");
}

export async function getOrder(id: string): Promise<OrderResponse> {
  return apiClient<OrderResponse>(`/orders/${id}`);
}

export async function createCheckoutSession(
  payload: CheckoutPayload,
): Promise<CheckoutSessionResponse> {
  return apiClient<CheckoutSessionResponse>("/orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
