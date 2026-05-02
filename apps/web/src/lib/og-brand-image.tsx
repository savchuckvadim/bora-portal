import { ImageResponse } from "next/og";
import { headers } from "next/headers";

import { getSiteUrl } from "@/config/site-metadata";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Базовый URL для загрузки /logo.png при генерации превью (OG / Twitter). */
async function resolvePublicOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) {
    return `${proto}://${host}`;
  }
  return getSiteUrl();
}

/**
 * Карточка предпросмотра ссылки: бренд + лого (как в шапке).
 * Используется в `opengraph-image.tsx` и `twitter-image.tsx`.
 */
export async function createBrandLinkPreviewImage(): Promise<ImageResponse> {
  const base = await resolvePublicOrigin();
  const logoUrl = `${base}/logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 45%, #0f172a 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Noto Sans", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            padding: "56px 72px",
            borderRadius: 24,
            border: "1px solid rgba(148, 163, 184, 0.25)",
            background: "rgba(15, 23, 42, 0.65)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori / ImageResponse */}
          <img
            src={logoUrl}
            alt=""
            width={128}
            height={128}
            style={{ borderRadius: 20, objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              maxWidth: 780,
            }}
          >
            <span
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#f8fafc",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Bora Portal
            </span>
            <span
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "#cbd5e1",
                lineHeight: 1.35,
              }}
            >
              Вместе создаём больше, чем просто работу
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
    },
  );
}
