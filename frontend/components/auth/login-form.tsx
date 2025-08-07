"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/apiService";
import { useState } from "react";
import { Loader } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || "/dashboard";
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const res = await apiService.post("/api/auth/login", data);

      const result = res.data;

      auth.login(result.token, result.user);

      toast.success("Logged in successfully!");
      router.push(callback);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
        <span className="text-red-500 text-md">{error}</span>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            placeholder="m@example.com"
            required
            {...register("email")}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
        </div>
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <Loader className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
