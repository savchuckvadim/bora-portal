import { appConfig } from "./config";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API request failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}
