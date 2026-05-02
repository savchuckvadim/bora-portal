"use client";

import type { ReactNode } from "react";

import type { PortalUserHeader } from "@/lib/portal-user";
import { PortalSidebar } from "./portal-sidebar";
import { Header } from "./header";
import { MainContent } from "./main-content";

type PortalShellProps = {
  children: ReactNode;
  user: PortalUserHeader | null;
};

export function PortalShell({ children, user }: PortalShellProps) {
  return (
    <div className="flex min-h-dvh w-full flex-row bg-background">
      <PortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
