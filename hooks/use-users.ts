"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { UsersTableFilters } from "@/types/users";
import { toast } from "sonner";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function useUsers(filters: UsersTableFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersApi.getUsers(filters),
    select: (data) => data.data,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersApi.getUser(userId),
    select: (data) => data.data,
    enabled: !!userId,
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: (data) => {
      toast.success(data.data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.restoreUser(userId),
    onSuccess: (data) => {
      toast.success(data.data.message || "User restored successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to restore user");
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      usersApi.updateUserRole(userId, roles),
    onSuccess: (data) => {
      toast.success(data.data.message || "User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      usersApi.updateUserStatus(userId, status),
    onSuccess: (data) => {
      toast.success(data.data.message || "User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update user status"
      );
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.verifyUser(userId),
    onSuccess: (data) => {
      toast.success(data.data.message || "User verified successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to verify user");
    },
  });
}

export function useVerifyKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.verifyKyc(userId),
    onSuccess: (data) => {
      toast.success(data.data.message || "KYC verified successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Failed to verify KYC");
    },
  });
}

export function useUpdateFraudRisk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, risk }: { userId: string; risk: string }) =>
      usersApi.updateFraudRisk(userId, risk),
    onSuccess: (data) => {
      toast.success(data.data.message || "Fraud risk updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update fraud risk"
      );
    },
  });
}

export function useUpdateDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, addressId }: { userId: string; addressId: string }) =>
      usersApi.updateDefaultAddress(userId, addressId),
    onSuccess: (data) => {
      toast.success(data.data.message || "Default address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to update default address"
      );
    },
  });
}
