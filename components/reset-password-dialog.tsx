"use client";

import { useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword, useForgotPassword } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  email,
}: ResetPasswordDialogProps) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const router = useRouter();

  const resetPasswordMutation = useResetPassword();
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (otp.length === 6 && newPassword.trim()) {
      resetPasswordMutation.mutate(
        { email, verificationCode: otp, newPassword },
        {
          onSuccess: () => {
            setIsResetSuccessful(true);
            setTimeout(() => {
              router.push("/login");
              onOpenChange(false);
              setOtp("");
              setNewPassword("");
              setIsResetSuccessful(false);
            }, 2000);
          },
          onError: () => {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
          },
        }
      );
    }
  };

  const handleResendOtp = () => {
    forgotPasswordMutation.mutate({ email });
  };

  const isFormValid = otp.length === 6 && newPassword.trim().length >= 6;
  const isDisabled = resetPasswordMutation.isPending || isResetSuccessful;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-md ${isShaking ? "animate-pulse" : ""}`}
      >
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            {isResetSuccessful ? (
              <span className="text-green-600 font-medium">
                ✓ Password reset successful! Redirecting to login...
              </span>
            ) : (
              <>
                Enter the OTP and your new password to reset your account
                password.
                <br />
                <span className="font-medium text-primary">
                  OTP sent to {email}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2 w-full">
              <Label>Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isDisabled}
                >
                  {isDisabled ? (
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  ) : (
                    <>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </>
                  )}
                </InputOTP>
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isDisabled}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-3 w-full">
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isDisabled}
              >
                {resetPasswordMutation.isPending
                  ? "Resetting password..."
                  : isResetSuccessful
                  ? "Password reset!"
                  : "Reset password"}
              </Button>

              {!isResetSuccessful && (
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={
                    forgotPasswordMutation.isPending ||
                    resetPasswordMutation.isPending
                  }
                  className="text-sm w-full"
                >
                  {forgotPasswordMutation.isPending
                    ? "Sending..."
                    : "Resend OTP"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
