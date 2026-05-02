'use client'
import { PortalUserHeader } from "@/lib/portal-user";

type CurrentUserProps = {
    user: PortalUserHeader | null;
};
export const CurrentUser = ({ user }: CurrentUserProps) => {
    return (
        <div className="hidden max-w-[200px] text-right text-sm sm:block">
            <p className="truncate font-medium text-foreground">
                {user?.name ?? "—"}
            </p>
            {user?.email ? (
                <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                </p>
            ) : null}
        </div>
    );
};
