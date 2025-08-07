"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService";
import { DataTable } from "@/components/data-table";
import { CreateUser } from "./create-user";
import z from "zod";
import { columns, userSchema } from "./columns";
import { QueryStatus } from "@/components/query-status";
import { isAxiosError } from "axios";

export function Users() {
  const {
    data = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiService.get<z.infer<typeof userSchema>[]>(
        "/api/admin/users"
      );
      return res?.data;
    },
    retry: false,
  });

  return (
    <QueryStatus
      isLoading={isLoading}
      error={error}
      loadingMessage="Fetching users..."
      errorMessage={
        isAxiosError(error)
          ? error?.response?.data?.message
          : "An unexpected error occurred"
      }
    >
      <DataTable<z.infer<typeof userSchema>>
        data={data}
        columns={columns}
        page="Users"
        actionSlot={<CreateUser />}
      />
    </QueryStatus>
  );
}
