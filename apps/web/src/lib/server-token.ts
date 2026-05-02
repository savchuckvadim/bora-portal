import { cookies } from "next/headers";

export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("portal_access_token")?.value ?? null;
}
