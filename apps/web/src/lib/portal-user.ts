import { cookies } from "next/headers";

export type PortalUserHeader = {
  name: string;
  email?: string;
};

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    try {
      const parts = token.split(".");
      const payload = parts[1]?.replace(/-/g, "+").replace(/_/g, "/");
      if (!payload) return null;
      const json = Buffer.from(payload, "base64").toString("utf8");
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

export async function getPortalUserFromCookie(): Promise<PortalUserHeader | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_access_token")?.value;
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const name =
    typeof payload.name === "string"
      ? payload.name
      : typeof payload.preferred_username === "string"
        ? payload.preferred_username
        : "User";
  const email = typeof payload.email === "string" ? payload.email : undefined;
  return { name, email };
}
