"use client";

import { useState, useEffect } from "react";
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
import { useVerify, useResendOtp } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  email: string;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export function OtpDialog({
  open,
  onOpenChange,
  username,
  email,
  title = "Verify your account",
  description = "Enter the 6-digit code sent to your email",
  onSuccess,
}: OtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const verifyMutation = useVerify();
  const resendOtpMutation = useResendOtp();

  useEffect(() => {
    // Only submit if OTP is filled and not already submitting or verified
    if (otp.length === 6 && !verifyMutation.isPending && !isVerified) {
      verifyMutation.mutate(
        { username, verificationCode: otp },
        {
          onSuccess: () => {
            setIsVerified(true);
            // Delay redirection to show success state
            setTimeout(() => {
              if (onSuccess) {
                onSuccess();
              } else {
                router.push("/");
              }
              onOpenChange(false);
              setOtp("");
              setIsVerified(false);
            }, 1500);
          },
          onError: () => {
            setIsShaking(true);
            setOtp("");
            setTimeout(() => setIsShaking(false), 500);
          },
        }
      );
    }
  }, [
    otp,
    username,
    verifyMutation.isPending,
    verifyMutation,
    onSuccess,
    router,
    onOpenChange,
    isVerified,
  ]);

  const handleResendOtp = () => {
    resendOtpMutation.mutate({ email });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-md ${isShaking ? "animate-pulse" : ""}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isVerified ? (
              <span className="text-green-600 font-medium">
                ✓ Verification successful! Redirecting...
              </span>
            ) : (
              <>
                {description}
                <br />
                <span className="font-medium text-primary">
                  Enter OTP sent at {email}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={verifyMutation.isPending || isVerified}
          >
            {verifyMutation.isPending || isVerified ? (
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

          {!isVerified && (
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={resendOtpMutation.isPending || verifyMutation.isPending}
              className="text-sm"
            >
              {resendOtpMutation.isPending ? "Sending..." : "Resend OTP"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
