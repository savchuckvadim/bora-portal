"use client";

import * as React from "react";

export type PortalSidebarVariant = "expanded" | "narrow";

const PortalSidebarVariantContext = React.createContext<PortalSidebarVariant>("expanded");

export function PortalSidebarDefaultsProvider({
  variant,
  children,
}: {
  variant: PortalSidebarVariant;
  children: React.ReactNode;
}) {
  return (
    <PortalSidebarVariantContext.Provider value={variant}>
      {children}
    </PortalSidebarVariantContext.Provider>
  );
}

export function usePortalSidebarVariant(): PortalSidebarVariant {
  return React.useContext(PortalSidebarVariantContext);
}
