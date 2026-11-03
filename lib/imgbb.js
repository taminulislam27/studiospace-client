// Uploads an image file to imgbb and returns its public URL.
export async function uploadToImgbb(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) {
    throw new Error("Image upload is not set up. Paste an image URL instead.");
  }

  const body = new FormData();
  body.append("image", file);

  let res;
  try {
    res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
      method: "POST",
      body,
    });
  } catch {
    throw new Error("Image upload failed. Check your connection and try again.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || "Image upload failed. Please try again.");
  }
  return json.data.display_url || json.data.url;
}
