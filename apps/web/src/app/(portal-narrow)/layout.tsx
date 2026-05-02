import type { ReactNode } from "react";

/** Группа `(portal-narrow)` — узкий сайдбар (rail) для экранов вроде мессенджера, где важна ширина контента. */
import { getPortalUserFromCookie } from "@/lib/portal-user";
import { PortalShell } from "@/modules/app/shell/portal-shell";
import { PortalSidebarDefaultsProvider } from "@/modules/app/shell/portal-sidebar-defaults";
import { SidebarProvider } from "@/modules/app/shell/sidebar-context";

export default async function PortalNarrowGroupLayout({ children }: { children: ReactNode }) {
  const user = await getPortalUserFromCookie();
  return (
    <SidebarProvider>
      <PortalSidebarDefaultsProvider variant="narrow">
        <PortalShell user={user}>{children}</PortalShell>
      </PortalSidebarDefaultsProvider>
    </SidebarProvider>
  );
}
