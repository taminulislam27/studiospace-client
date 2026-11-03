import { issueJwt } from "./jwt-client";

// Calls the Express server through the /backend rewrite (see next.config.mjs),
// so the HTTPOnly JWT cookie is sent as a first-party cookie.
//
// Errors carry .status and .data, so callers can react to 401/403/409 and read
// extra details such as the booking conflict.
export async function api(path, { method = "GET", body, signal } = {}) {
  const send = () =>
    fetch(`/backend${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
      cache: "no-store",
    });

  let res = await send();

  // A missing or expired JWT cookie while the BetterAuth session is still valid:
  // mint a fresh cookie once and retry the request.
  if (res.status === 401 && (await issueJwt())) {
    res = await send();
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Your session expired. Please log in again."
        : data?.message || "Something went wrong. Please try again.";
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}
