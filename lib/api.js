import { issueJwt } from "./jwt-client";

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
