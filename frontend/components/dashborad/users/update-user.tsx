"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FilePen } from "lucide-react";
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
import { roleSchema } from "../roles/columns";
import { userFormSchema } from "./create-user";

export const userUpdateSchema = userFormSchema
  .omit({ password: true })
  .extend({
    _id: z.string(),
  });

export function UpdateUser({
  user,
  open,
  onOpenChange,
}: {
  user: z.infer<typeof userUpdateSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [roles, setRoles] = useState<z.infer<typeof roleSchema>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      _id : user._id,
      username: user.username,
      email: user.email,
      roles: user.roles || [],
    },
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      setIsLoading(true);
      const response = await apiService.get("/api/admin/roles");
      setRoles(response?.data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    try {
      console.log("values=>", values);
      setIsSubmitting(true);

      // Prepare the data to match your API requirements
      const payload = {
        username: values.username,
        email: values.email,
        roles: values.roles.map((role) => role._id),
      };
      const response = await apiService.put(
        `/api/admin/user/${user._id}`,
        payload
      );
      toast.success(`${response?.data.message}`);

      onOpenChange(false);

      // Reset form on success
      form.reset();
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Update User
          </Dialog.Title>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles"
                render={() => (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    {isLoading ? (
                      <div className="text-sm text-muted-foreground">
                        Loading roles...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {roles.map((role) => (
                          <FormField
                            key={role._id}
                            control={form.control}
                            name="roles"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.some(
                                        (r) => r._id === role._id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              role,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value._id !== role._id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {role.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Dialog.Close asChild>
                  <Button variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? "Updating..." : "Update User"}
                </Button>
              </div>
            </form>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
