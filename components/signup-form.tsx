"use client";

import { useState, FormEvent } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/use-auth";
import { OtpDialog } from "@/components/otp-dialog";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const signupMutation = useSignup();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData, {
      onSuccess: () => {
        setIsSignupSuccessful(true);
        setShowOtpDialog(true);
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
            <h1 className="text-xl font-bold">Create your account</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Sign in
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
                disabled={signupMutation.isPending || isSignupSuccessful}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={signupMutation.isPending || isSignupSuccessful}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={signupMutation.isPending || isSignupSuccessful}
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
                disabled={signupMutation.isPending || isSignupSuccessful}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending || isSignupSuccessful}
            >
              {signupMutation.isPending
                ? "Creating account..."
                : isSignupSuccessful
                ? "Account created!"
                : "Sign up"}
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking sign up, you agree to our{" "}
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

      <OtpDialog
        open={showOtpDialog}
        onOpenChange={setShowOtpDialog}
        username={formData.username}
        email={formData.email}
        title="Verify your account"
        description="Enter the 6-digit code sent to your email to complete registration"
      />
    </div>
  );
}
