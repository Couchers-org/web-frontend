import { HttpError } from "service/http";

export default function isHttpError(e: unknown): e is HttpError {
  if (typeof e === "object" && e) {
    return "status_code" in e && ("error_messages" in e || "errors" in e);
  }
  return false;
}
