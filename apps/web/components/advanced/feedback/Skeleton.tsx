"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-muted",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded",
        variant === "rectangular" && "rounded-md",
        animation === "pulse" && "animate-pulse",
        animation === "wave" && "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/20 to-muted bg-[length:400%_100%]",
        className
      )}
    />
  );
}

// Componentes preconfigurados
export function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-lg border border-border p-6">
      <Skeleton className="h-4 w-3/4" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" variant="text" />
        <Skeleton className="h-3 w-full" variant="text" />
        <Skeleton className="h-3 w-4/5" variant="text" />
      </div>
    </div>
  );
}

export function SkeletonAvatar() {
  return <Skeleton className="h-12 w-12" variant="circular" />;
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-4/5" : "w-full"}`}
          variant="text"
        />
      ))}
    </div>
  );
}
