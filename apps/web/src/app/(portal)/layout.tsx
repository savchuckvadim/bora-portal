import type { ReactNode } from "react";

/** Группа `(portal)` — сайдбар в развёрнутом виде (dashboard, посты, пользователи). Скобки в имени папки не входят в URL. */
import { getPortalUserFromCookie } from "@/lib/portal-user";
import { PortalShell } from "@/modules/app/shell/portal-shell";
import { PortalSidebarDefaultsProvider } from "@/modules/app/shell/portal-sidebar-defaults";
import { SidebarProvider } from "@/modules/app/shell/sidebar-context";

export default async function PortalGroupLayout({ children }: { children: ReactNode }) {
  const user = await getPortalUserFromCookie();
  return (
    <SidebarProvider>
      <PortalSidebarDefaultsProvider variant="expanded">
        <PortalShell user={user}>{children}</PortalShell>
      </PortalSidebarDefaultsProvider>
    </SidebarProvider>
  );
}
