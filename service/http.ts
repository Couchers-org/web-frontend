const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface HttpError {
  status_code: number;
  error_messages: string[];
  errors: {
    [key: string]: string[];
  };
}

async function http<T>(
  endpoint: string,
  configOverride: RequestInit
): Promise<T> {
  const url = new URL(endpoint, API_URL).toString();
  const config = {
    headers: {
      "content-type": "application/json",
    },
    ...configOverride,
  };
  const request = new Request(url, config);
  const response = await fetch(request);

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw responseBody as HttpError;
  }

  return responseBody;
}

export async function get<T>(path: string, config?: RequestInit): Promise<T> {
  const init = { method: "get", ...config };
  return await http<T>(path, init);
}

export async function post<T, U>(
  path: string,
  body: T,
  config?: Omit<RequestInit, "body">
): Promise<U> {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}

export async function put<T, U>(
  path: string,
  body: T,
  config?: Omit<RequestInit, "body">
): Promise<U> {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return await http<U>(path, init);
}
