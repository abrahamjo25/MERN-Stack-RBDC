"use client";

import { Loader2 } from "lucide-react";

type LoadingProps = {
  message?: string;
  className?: string;
  iconSize?: number;
};

export function Loading({
  message = "Loading...",
  className = "",
  iconSize = 24,
}: LoadingProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className="animate-spin" size={iconSize} />
      <span>{message}</span>
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loading message="Loading application..." iconSize={32} />
    </div>
  );
}