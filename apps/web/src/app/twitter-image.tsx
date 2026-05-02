import { createBrandLinkPreviewImage, OG_SIZE } from "@/lib/og-brand-image";

export const alt = "Bora Portal";
export const size = OG_SIZE;
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function TwitterImage() {
  return createBrandLinkPreviewImage();
}
