import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { Providers } from "@/modules/app/providers/providers";
import { rootSiteMetadata } from "@/config/site-metadata";

export const metadata: Metadata = rootSiteMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
