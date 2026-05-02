"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

import { usePortalSidebarVariant } from "./portal-sidebar-defaults";
import { useSidebar } from "./sidebar-context";
import { BrandMark } from "./brand-mark";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const NAV_ITEMS: PortalNavItem[] = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard className="size-5 shrink-0" /> },
  { href: "/users", label: "Users", icon: <Users className="size-5 shrink-0" /> },
  { href: "/posts", label: "Posts", icon: <FileText className="size-5 shrink-0" /> },
  { href: "/messenger", label: "Messenger", icon: <MessageCircle className="size-5 shrink-0" /> },
];

function NavLink({
  item,
  isActive,
  narrow,
  onNavigate,
}: {
  item: PortalNavItem;
  isActive: boolean;
  narrow: boolean;
  onNavigate: () => void;
}) {
  const inner = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        narrow ? "md:justify-center md:group-hover:justify-start" : "md:justify-start",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {item.icon}
      <span
        className={cn(
          "truncate",
          narrow &&
            "md:max-w-0 md:opacity-0 md:overflow-hidden md:transition-[max-width,opacity] md:duration-200 md:group-hover:max-w-[11rem] md:group-hover:opacity-100",
        )}
      >
        {item.label}
      </span>
    </Link>
  );

  if (!narrow) {
    return inner;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{inner}</TooltipTrigger>
      <TooltipContent side="right" className="max-md:hidden">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

export function PortalSidebar() {
  const pathname = usePathname();
  const variant = usePortalSidebarVariant();
  const narrow = variant === "narrow";
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh shrink-0 flex-col  transition-[width,transform] duration-200 ease-out",
          "w-56 -translate-x-full",
          isOpen && "translate-x-0",
          "md:relative md:z-auto md:h-auto md:min-h-screen md:translate-x-0",
          narrow ? "group md:w-14 md:overflow-hidden md:hover:w-56" : "md:w-56",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-3 md:px-2">
          <BrandMark
            onClick={close}
            className={cn(
              narrow && "md:justify-center md:group-hover:justify-start",
            )}
            labelClassName={cn(
              narrow &&
                "md:max-w-0 md:opacity-0 md:overflow-hidden md:transition-[max-width,opacity] md:duration-200 md:group-hover:max-w-[9rem] md:group-hover:opacity-100",
            )}
          />
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <NavLink
                key={item.href}
                item={item}
                isActive={isActive}
                narrow={narrow}
                onNavigate={close}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function PortalSidebarMobileTrigger() {
  const { toggle, isOpen } = useSidebar();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="md:hidden"
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
      onClick={toggle}
    >
      <span className="sr-only">Menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </>
        )}
      </svg>
    </Button>
  );
}
