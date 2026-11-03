// Asks the Next.js server to set the HTTPOnly JWT cookie for the signed-in user.
export async function issueJwt() {
  try {
    const res = await fetch("/api/jwt", {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearJwt() {
  try {
    await fetch("/api/jwt", { method: "DELETE", credentials: "include" });
  } catch {
    // Nothing to do: the cookie simply expires on its own.
  }
}
