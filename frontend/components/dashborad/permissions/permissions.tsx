"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService";
import { DataTable } from "@/components/data-table";
import z from "zod";
import { QueryStatus } from "@/components/query-status";
import { CreatePermission } from "./create-permission";
import { columns, permissionSchema } from "./columns";
import { isAxiosError } from "axios";

export function Permissions() {
  const {
    data = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await apiService.get<z.infer<typeof permissionSchema>[]>(
        "/api/admin/permission"
      );
      return res?.data;
    },
    retry: false, // ⛔️ Disable auto retry
  });
  return (
    <QueryStatus
      isLoading={isLoading}
      error={error}
      loadingMessage="Fetching permissions..."
      errorMessage={
        isAxiosError(error)
          ? error?.response?.data?.message
          : "An unexpected error occurred"
      }
    >
      <DataTable<z.infer<typeof permissionSchema>>
        data={data}
        columns={columns}
        page="Permissions"
        actionSlot={<CreatePermission />}
      />
    </QueryStatus>
  );
}
