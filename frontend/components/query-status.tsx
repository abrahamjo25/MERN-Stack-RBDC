"use client";

import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableSkeleton } from "./table-skeleton";

type QueryStatusProps = {
  isLoading: boolean;
  error: unknown;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
};

export function QueryStatus({
  isLoading,
  error,
  loadingMessage = "Loading data...",
  errorMessage = "Failed to load data",
  children,
}: QueryStatusProps) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center px-4">
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
