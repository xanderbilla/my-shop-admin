"use client";

import { useState, FormEvent } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/use-auth";
import { ResetPasswordDialog } from "@/components/reset-password-dialog";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsEmailSent(true);
          setShowResetDialog(true);
        },
      }
    );
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
            <h1 className="text-xl font-bold">Reset your password</h1>
            <div className="text-center text-sm text-muted-foreground">
              Enter your email address and we&apos;ll send you a verification
              code.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={forgotPasswordMutation.isPending || isEmailSent}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={forgotPasswordMutation.isPending || isEmailSent}
            >
              {forgotPasswordMutation.isPending
                ? "Sending code..."
                : isEmailSent
                ? "Code sent!"
                : "Send code"}
            </Button>
          </div>
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm underline underline-offset-4 hover:text-primary"
            >
              Back to login
            </Link>
          </div>
        </div>
      </form>

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        email={email}
      />
    </div>
  );
}
