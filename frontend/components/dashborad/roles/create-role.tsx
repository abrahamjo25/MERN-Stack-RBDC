"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { apiService } from "@/lib/apiService";
import { toast } from "sonner";
import { permissionSchema } from "../permissions/columns";
import { redirect, useRouter } from "next/navigation";
// Permission schema
const permissions = z.object({
  _id: z.string(),
  name: z.string(),
});

// Form schema
export const roleFormSchema = z.object({
  name: z.string().min(1, {
    message: "Role name is required",
  }),

  permissions: z.array(permissions).min(1, {
    message: "Select at least one permission",
  }),
});

export function CreateRole() {
  const [permissions, setPermissions] = useState<
    z.infer<typeof permissionSchema>[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  async function fetchPermissions() {
    try {
      setIsLoading(true);
      const response = await apiService.get("/api/admin/permission");
      setPermissions(response?.data);
    } catch (error) {
      toast("Failed to load permissions");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof roleFormSchema>) {
    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        permissions: values.permissions.map((per) => per._id),
      };
      const response = await apiService.post("/api/admin/role", payload);
      toast.success(`${response?.data.message}`);

      router.push("/dashboard/roles");

      form.reset();
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }
  const [search, setSearch] = useState("");

  const filteredPermissions = permissions.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="px-6 py-8 bg-white  rounded-2xl">
      <h2 className="text-md font-semibold mb-6 text-gray-800">
        Create New Role
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Role Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Admin, Editor"
                    {...field}
                    className="w-full mt-1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permissions */}
          <FormField
            control={form.control}
            name="permissions"
            render={() => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Assign Permissions
                </FormLabel>

                <div className="mb-2 flex items-center justify-between">
                  <Input
                    placeholder="Search permissions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-1/4"
                  />
                  {/* Actions */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-6 py-2"
                  >
                    {isSubmitting ? "Creating..." : "Create Role"}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading permissions...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border rounded-md p-4 bg-gray-50 max-h-96 overflow-auto">
                    {filteredPermissions.length > 0 ? (
                      filteredPermissions.map((permission) => (
                        <FormField
                          key={permission._id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => (
                            <FormItem className="flex items-start gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.some(
                                    (r) => r._id === permission._id
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          permission,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) =>
                                              value._id !== permission._id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-0.5">
                                <FormLabel className="font-medium text-gray-800">
                                  {permission.name}
                                </FormLabel>
                                <p className="text-xs text-gray-500">
                                  {permission.method} — {permission.route}
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 col-span-full">
                        No permissions found.
                      </div>
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
