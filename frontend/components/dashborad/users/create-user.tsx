"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
// Role schema
const roleSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

// Form schema
export const userFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  roles: z.array(roleSchema).min(1, {
    message: "Select at least one role",
  }),
});

export function CreateUser() {
  const [roles, setRoles] = useState<z.infer<typeof roleSchema>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      roles: [],
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
      toast("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    try {
      setIsSubmitting(true);
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        roles: values.roles.map((role) => role._id),
      };
      const response = await apiService.post("/api/admin/user", payload);
      toast.success(`${response?.data.message}`);

      setIsOpen(false);

      // Reset form on success
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          <span className="hidden lg:inline">Add User</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg">
          <Dialog.Title className="text-lg font-bold mb-4">
            Create New User
          </Dialog.Title>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields remain the same as before */}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
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
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
