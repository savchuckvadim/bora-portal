"use client";

import { PortalSidebarMobileTrigger } from "./portal-sidebar";
import { ThemeToggler } from "@workspace/theme/index";
import { PortalUserHeader } from "@/lib/portal-user";
import { Button } from "@/components/ui/button";
// import { BrandMark } from "./brand-mark";
import { CurrentUser } from "./current-user";

type HeaderProps = {
    user: PortalUserHeader | null;
};

export const Header = ({ user }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-30 flex w-full ">
            <div className="flex h-16 w-full items-center justify-between gap-3 px-3 md:px-4">
                <div className="flex min-w-0 items-center gap-2">
                    <PortalSidebarMobileTrigger />

                </div>
                <div className="flex shrink-0 items-center gap-2 md:gap-3">
                    <ThemeToggler />

                    <CurrentUser user={user} />
                    <Button variant="outline" size="sm" asChild>
                        <a href="/api/auth/logout">Logout</a>
                    </Button>
                </div>
            </div>
        </header>
    );
};
