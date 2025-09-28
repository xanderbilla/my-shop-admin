"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UsersDataTable } from "@/components/users/users-data-table";
import {
  UpdateRolesDialog,
  UpdateFraudRiskDialog,
  UpdateStatusDialog,
} from "@/components/users/update-dialogs";
import {
  useUsers,
  useDeleteUser,
  useRestoreUser,
  useVerifyUser,
  useUpdateUserRole,
  useVerifyKyc,
  useUpdateFraudRisk,
} from "@/hooks/use-users";
import { UsersTableFilters, User } from "@/types/users";

export default function UsersPage() {
  const [filters, setFilters] = useState<UsersTableFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  // Dialog states
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false);
  const [fraudRiskDialogOpen, setFraudRiskDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, error } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();
  const restoreUserMutation = useRestoreUser();
  const verifyUserMutation = useVerifyUser();
  const updateUserRoleMutation = useUpdateUserRole();
  const verifyKycMutation = useVerifyKyc();
  const updateFraudRiskMutation = useUpdateFraudRisk();

  const handleFiltersChange = (newFilters: Partial<UsersTableFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleDelete = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const handleRestore = (userId: string) => {
    restoreUserMutation.mutate(userId);
  };

  const handleVerify = (userId: string) => {
    verifyUserMutation.mutate(userId);
  };

  const handleUpdateRole = (userId: string, roles: string[]) => {
    const user = data?.data?.data.find((u) => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      setRolesDialogOpen(true);
    }
  };

  const handleVerifyKyc = (userId: string) => {
    verifyKycMutation.mutate(userId);
  };

  const handleUpdateFraudRisk = (userId: string, risk: string) => {
    const user = data?.data?.data.find((u) => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      setFraudRiskDialogOpen(true);
    }
  };

  const handleUpdateStatus = (userId: string) => {
    const user = data?.data?.data.find((u) => u.userId === userId);
    if (user) {
      setSelectedUser(user);
      setStatusDialogOpen(true);
    }
  };

  // Dialog handlers
  const handleRolesSubmit = (roles: string[]) => {
    if (selectedUser) {
      updateUserRoleMutation.mutate(
        { userId: selectedUser.userId, roles },
        {
          onSuccess: () => {
            setRolesDialogOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleFraudRiskSubmit = (risk: string) => {
    if (selectedUser) {
      updateFraudRiskMutation.mutate(
        { userId: selectedUser.userId, risk },
        {
          onSuccess: () => {
            setFraudRiskDialogOpen(false);
            setSelectedUser(null);
          },
        }
      );
    }
  };

  const handleStatusSubmit = (status: string) => {
    if (selectedUser) {
      // You'll need to create a mutation for updating status
      // For now, using the verify mutation as placeholder
      verifyUserMutation.mutate(selectedUser.userId, {
        onSuccess: () => {
          setStatusDialogOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  if (error) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="text-center text-red-500">
                Error loading users:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Users</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <UsersDataTable
              data={data?.data?.data || []}
              totalRecords={data?.data?.totalRecords || 0}
              totalPages={data?.data?.totalPages || 0}
              currentPage={data?.data?.page || 1}
              hasNext={data?.data?.hasNext || false}
              hasPrevious={data?.data?.hasPrevious || false}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onDelete={handleDelete}
              onRestore={handleRestore}
              onVerify={handleVerify}
              onUpdateRole={handleUpdateRole}
              onVerifyKyc={handleVerifyKyc}
              onUpdateFraudRisk={handleUpdateFraudRisk}
              onUpdateStatus={handleUpdateStatus}
              isLoading={isLoading}
            />
          </div>
        </SidebarInset>

        {/* Update Dialogs */}
        {selectedUser && (
          <>
            <UpdateRolesDialog
              open={rolesDialogOpen}
              onOpenChange={setRolesDialogOpen}
              currentRoles={selectedUser.roles}
              onUpdate={handleRolesSubmit}
              isLoading={updateUserRoleMutation.isPending}
            />

            <UpdateFraudRiskDialog
              open={fraudRiskDialogOpen}
              onOpenChange={setFraudRiskDialogOpen}
              currentRisk={selectedUser.fraudRisk}
              onUpdate={handleFraudRiskSubmit}
              isLoading={updateFraudRiskMutation.isPending}
            />

            <UpdateStatusDialog
              open={statusDialogOpen}
              onOpenChange={setStatusDialogOpen}
              currentStatus={selectedUser.userStatus}
              onUpdate={handleStatusSubmit}
              isLoading={verifyUserMutation.isPending}
            />
          </>
        )}
      </SidebarProvider>
    </AuthGuard>
  );
}
