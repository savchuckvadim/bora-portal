import { NextResponse } from "next/server";
import { appConfig } from "@/lib/config";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;
  const authUrl = new URL(`${appConfig.keycloakIssuer}/protocol/openid-connect/auth`);
  authUrl.searchParams.set("client_id", appConfig.keycloakClientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(authUrl);
}
