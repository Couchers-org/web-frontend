import { httpTimeout } from "appConstants";
import isHttpError from "utils/isHttpError";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface HttpError {
  status_code: number;
  error_messages: string[];
  errors: {
    [key: string]: string[];
  };
}

let _unauthenticatedErrorHandler: (
  e: HttpError
) => Promise<void> = async () => {};
export const setUnauthenticatedErrorHandler = (
  f: (e: HttpError) => Promise<void>
) => {
  _unauthenticatedErrorHandler = f;
};

function getAuthToken(): string {
  const rawToken = window.localStorage.getItem("auth.token");
  const token = rawToken && rawToken?.length > 0 ? JSON.parse(rawToken) : "";
  return token;
}

async function http<TResponse>(
  endpoint: string,
  configOverride: RequestInit
): Promise<TResponse> {
  const url = new URL(endpoint, API_URL).toString();
  const httpAbortController = new AbortController();
  const config = {
    headers: {
      "content-type": "application/json",
    },
    signal: httpAbortController.signal,
    ...configOverride,
  };
  const request = new Request(url, config);
  const response = await fetch(request);

  setTimeout(() => httpAbortController.abort(), httpTimeout);

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw responseBody as HttpError;
  }

  return responseBody;
}

async function authenticatedHttp<TResponse>(
  endpoint: string,
  configOverride: RequestInit
): Promise<TResponse> {
  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `token ${getAuthToken()}`,
    },
    mode: "cors" as RequestMode,
    ...configOverride,
  };

  return http<TResponse>(endpoint, config).catch((error) => {
    if (isHttpError(error) && error.status_code === 401) {
      _unauthenticatedErrorHandler(error);
    }
    throw error;
  });
}

export async function get<TResponse>(
  path: string,
  config?: RequestInit
): Promise<TResponse> {
  const init = { method: "get", ...config };
  return await http<TResponse>(path, init);
}

export async function authenticedGet<TResponse>(
  path: string,
  config?: RequestInit
): Promise<TResponse> {
  const init = { method: "get", ...config };
  return await authenticatedHttp<TResponse>(path, init);
}

export async function post<TBody, TResponse>(
  path: string,
  body: TBody,
  config?: Omit<RequestInit, "body">
): Promise<TResponse> {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await http<TResponse>(path, init);
}

export async function authenticatedPost<TBody, TResponse>(
  path: string,
  body: TBody,
  config?: Omit<RequestInit, "body">
): Promise<TResponse> {
  const init = { method: "post", body: JSON.stringify(body), ...config };
  return await authenticatedHttp<TResponse>(path, init);
}

export async function put<TBody, TResponse>(
  path: string,
  body?: TBody,
  config?: Omit<RequestInit, "body">
): Promise<TResponse> {
  const init = { method: "put", body: JSON.stringify(body), ...config };
  return await http<TResponse>(path, init);
}

export async function patch<TBody, TResponse>(
  path: string,
  body: TBody,
  config?: Omit<RequestInit, "body">
): Promise<TResponse> {
  const init = { method: "PATCH", body: JSON.stringify(body), ...config };
  return await http<TResponse>(path, init);
}
