import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useSignin = () => {
  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (response) => {
      toast.success(response.data.message || "Successfully signed in!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(error.response?.data?.message || "Sign in failed");
      }
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (response) => {
      toast.success(response.data.message || "Account created successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(error.response?.data?.message || "Sign up failed");
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => {
      toast.success(response.data.message || "Reset code sent to your email!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(
          error.response?.data?.message || "Failed to send reset code"
        );
      }
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authApi.resendOtp,
    onSuccess: (response) => {
      toast.success(response.data.message || "OTP resent successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      }
    },
  });
};

export const useVerify = () => {
  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: (response) => {
      toast.success(response.data.message || "Verification successful!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(error.response?.data?.message || "Verification failed");
      }
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      toast.success(response.data.message || "Password reset successfully!");
    },
    onError: (error: AxiosError<ApiError>) => {
      if (!error.response) {
        toast.error(
          "Unable to connect to server. Please check if the server is running."
        );
      } else {
        toast.error(error.response?.data?.message || "Password reset failed");
      }
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: (failureCount, error: AxiosError) => {
      // Don't retry on 401 or 503 errors
      if (error?.response?.status === 401 || error?.response?.status === 503) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
