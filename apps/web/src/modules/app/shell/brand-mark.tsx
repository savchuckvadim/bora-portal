"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@workspace/ui/lib/utils";

type BrandMarkProps = {
  href?: string;
  className?: string;
  labelClassName?: string;
  showLabel?: boolean;
  onClick?: () => void;
};

export function BrandMark({
  href = "/",
  className,
  labelClassName,
  showLabel = true,
  onClick,
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex min-w-0 items-center gap-2 text-foreground", className)}
    >
      <Image
        src="/logo.png"
        alt="Bora"
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-md object-contain"
        priority
      />
      {showLabel ? (
        <span
          className={cn(
            "truncate text-lg font-semibold tracking-tight",
            labelClassName,
          )}
        >
          Bora Portal
        </span>
      ) : null}
    </Link>
  );
}
