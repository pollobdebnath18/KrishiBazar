const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("text/html") || text.trim().startsWith("<!DOCTYPE")) {
    throw new Error(
      "API returned an HTML page instead of JSON. Check the backend base URL.",
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("API returned a non-JSON response.");
  }

  if (!response.ok) {
    const payload = data as { message?: string };
    throw new Error(payload.message || "something went wrong");
  }

  return data as T;
}
