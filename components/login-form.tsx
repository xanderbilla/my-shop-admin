"use client";

import { useState, FormEvent } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignin } from "@/hooks/use-auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();
  const signinMutation = useSignin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signinMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome back</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={signinMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={signinMutation.isPending}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm underline underline-offset-4 hover:text-primary"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={signinMutation.isPending}
            >
              {signinMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking sign in, you agree to our{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
