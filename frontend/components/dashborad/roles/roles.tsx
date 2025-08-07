"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService";
import { DataTable } from "@/components/data-table";
import z from "zod";
import { QueryStatus } from "@/components/query-status";
import { columns, roleSchema } from "./columns";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { isAxiosError } from "axios";

export function Roles() {
  const {
    data = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await apiService.get<z.infer<typeof roleSchema>[]>(
        "/api/admin/roles"
      );
      return res?.data;
    },
    retry: false,
  });

  return (
    <QueryStatus
      isLoading={isLoading}
      error={error}
      loadingMessage="Fetching roles..."
      errorMessage={
        isAxiosError(error)
          ? error?.response?.data?.message
          : "An unexpected error occurred"
      }
    >
      <DataTable<z.infer<typeof roleSchema>>
        data={data}
        columns={columns}
        page="Roles"
        actionSlot={
          <Button variant="outline" size="sm">
            <Link
              href={`/dashboard/roles/create`}
              className="flex items-center"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Role</span>
            </Link>
          </Button>
        }
      />
    </QueryStatus>
  );
}
