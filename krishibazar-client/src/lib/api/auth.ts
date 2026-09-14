import { apiClient } from "./client";
import type { DashboardRole } from "@/lib/dashboard/navigation";

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  upazila?: string;
  district?: string;
  role: DashboardRole | string;
}

export interface AuthLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUserPayload;
  };
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  mobile: string;
  upazila: string;
  district: string;
  role: DashboardRole;
  status: "ACTIVE" | "INACTIVE";
  joinedAt: string;
}

export interface UserListResponse {
  success: boolean;
  data: UserListItem[];
}

export async function RegisterUser(data: {
  name: string;
  email: string;
  mobile: string;
  upazila: string;
  district: string;
  password: string;
  role: string;
}): Promise<AuthLoginResponse> {
  return apiClient<AuthLoginResponse>("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function LoginUser(data: {
  email: string;
  password: string;
}): Promise<AuthLoginResponse> {
  return apiClient<AuthLoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function FetchMe(): Promise<{
  success: boolean;
  data: {
    token: string;
    user: AuthUserPayload;
  };
}> {
  return apiClient<{ success: boolean; data: { token: string; user: AuthUserPayload } }>(
    "/users/me",
    { method: "GET" },
  );
}

export async function GetUsers(role?: string): Promise<UserListResponse> {
  const params = role ? `?role=${role}` : "";
  return apiClient<UserListResponse>(`/users${params}`, { method: "GET" });
}

export async function DeleteUser(id: string): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}
