"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { permissionSchema } from "./columns";
import { apiService } from "@/lib/apiService";
import { toast } from "sonner";


export const PermissionFormValues = z.object({
  _id: z.string(),
  name: z.string(),
  route: z.string(),
  method: z.string(),
  requiresAuth: z.boolean(),
});

interface UpdatePermissionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: z.infer<typeof PermissionFormValues>;
}

export const UpdatePermission = ({
  open,
  onOpenChange,
  permission,
}: UpdatePermissionProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof PermissionFormValues>>({
    resolver: zodResolver(PermissionFormValues), 
    defaultValues: permission,
  });

  useEffect(() => {
    if (permission) {
      reset(permission);
    }
  }, [permission, reset]);

  const onSubmit = async (data: z.infer<typeof PermissionFormValues>) => {
    try {
        console.log(data)
      await apiService.put(`/api/admin/permission/${data._id}`, data);
      toast.success("Permission Updated");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update permission"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Permission</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="route">Route</Label>
            <Input id="route" {...register("route")} />
            {errors.route && (
              <p className="text-sm text-red-500">{errors.route.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="method">Method</Label>
            <Input id="method" {...register("method")} />
            {errors.method && (
              <p className="text-sm text-red-500">{errors.method.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresAuth"
              checked={watch("requiresAuth")}
              onCheckedChange={(checked) => setValue("requiresAuth", !!checked)}
            />
            <Label htmlFor="requiresAuth">Requires Auth</Label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Permission"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
