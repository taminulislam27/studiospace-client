// Only allow redirects to paths inside this site (blocks open-redirect tricks).
export function safeRedirect(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
