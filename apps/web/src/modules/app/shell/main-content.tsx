"use client";

import type { ReactNode } from "react";


type MainContentProps = {
    children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
    return (
        <main className="flex w-full flex-1 flex-col bg-card p-3 md:p-4 rounded-t-xl">
            <div className="container">
                {children}
            </div>
        </main>
    );
}
