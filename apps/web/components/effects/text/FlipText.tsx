"use client";

import { cn } from "@/lib/utils";

interface FlipTextProps {
  word: string;
  duration?: number;
  delayMultiple?: number;
  className?: string;
}

export function FlipText({
  word,
  duration = 0.5,
  delayMultiple = 0.08,
  className,
}: FlipTextProps) {
  return (
    <div className="flex justify-center space-x-2">
      {word.split("").map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block animate-flip opacity-0",
            className
          )}
          style={{
            animationDelay: `${i * delayMultiple}s`,
            animationDuration: `${duration}s`,
            animationFillMode: "forwards",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
