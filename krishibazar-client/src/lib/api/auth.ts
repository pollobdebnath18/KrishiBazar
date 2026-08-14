import { apiClient } from "./client";

export async function RegisterUser(data: {
  name: string;
  email: string;
  mobile: string;
  upazila: string;
  district: string;
  password: string;
  role: string;
}) {
  return apiClient("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function LoginUser(data: { email: string; password: string }) {
  return apiClient("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
