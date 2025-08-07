"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { apiService } from "@/lib/apiService";
import { PlusIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";

const permissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  route: z.string().min(1, "Route is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  requiresAuth: z.boolean().default(true),
});

type PermissionFormData = z.infer<typeof permissionSchema>;

const methodColors: Record<string, string> = {
  GET: "text-green-600",
  POST: "text-blue-600",
  PUT: "text-yellow-600",
  PATCH: "text-purple-600",
  DELETE: "text-red-600",
};

export function CreatePermission() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      method: "GET",
    },
  });

  const currentMethod = watch("method") || "GET";

  const onSubmit = async (data: PermissionFormData) => {
    try {
      await apiService.post("/api/admin/permission", data);
      toast.success("Permission created");
      reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create permission"
      );
    }
  };

  return (
    <div className="p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            <span className="hidden lg:inline">Add Permission</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="eg, User View"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Input
                id="route"
                {...register("route")}
                placeholder="ex, /api/admin/user"
              />
              {errors.route && (
                <p className="text-sm text-red-600">{errors.route.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Method</Label>
              <Select
                onValueChange={(value) => setValue("method", value as any)}
                defaultValue="GET"
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select HTTP method"
                    className={methodColors[currentMethod]}
                  />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(methodColors).map(([method, color]) => (
                    <SelectItem key={method} value={method} className={color}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.method && (
                <p className="text-sm text-red-600">{errors.method.message}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresAuth"
                checked={watch("requiresAuth")}
                onCheckedChange={(value) =>
                  setValue("requiresAuth", value as boolean)
                }
              />
              <Label htmlFor="requiresAuth">Requires Auth</Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
