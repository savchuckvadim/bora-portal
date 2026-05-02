import { NextResponse } from "next/server";
import { appConfig } from "@/lib/config";

type TokenResponse = {
  access_token: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const redirectUri = `${url.origin}/api/auth/callback`;
  const tokenUrl = `${appConfig.keycloakIssuer}/protocol/openid-connect/token`;

  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("client_id", appConfig.keycloakClientId);
  body.set("redirect_uri", redirectUri);

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const tokenData = (await tokenResponse.json()) as TokenResponse;
  await fetch(`${appConfig.apiBaseUrl}/users/sync/me`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData.access_token}`,
    },
    cache: "no-store",
  }).catch(() => undefined);

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("portal_access_token", tokenData.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return response;
}
