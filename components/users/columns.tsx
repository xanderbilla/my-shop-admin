"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/users";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  UserCheck,
  Shield,
  AlertTriangle,
  Users,
  ArrowUpDown,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
}

interface ColumnActions {
  onDelete: (userId: string) => void;
  onRestore: (userId: string) => void;
  onVerify: (userId: string) => void;
  onUpdateRole: (userId: string, roles: string[]) => void;
  onVerifyKyc: (userId: string) => void;
  onUpdateFraudRisk: (userId: string, risk: string) => void;
  onUpdateStatus: (userId: string) => void;
}

export function createColumns(actions: ColumnActions): ColumnDef<User>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const displayId = userId ? userId.slice(-6).toUpperCase() : "N/A";

        return (
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm text-gray-600">{displayId}</span>
            {userId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(userId);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "custName",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        const lastLogin = user.lastLogin
          ? format(new Date(user.lastLogin), "MMM d, yyyy 'at' h:mm a")
          : "Never";

        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.profilePicture || undefined}
                alt={user.custName}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {user.custName ? (
                  user.custName.charAt(0).toUpperCase()
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="font-medium text-gray-900">
                {user.custName || "N/A"}
              </div>
              <div className="text-xs text-gray-500">
                Last login: {lastLogin}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-900">{user.email || "N/A"}</div>
            <div className="text-xs text-gray-500">
              {user.phone || "No phone"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.getValue("roles") as string[];

        if (!roles || roles.length === 0) {
          return <span className="text-gray-400 text-sm">No roles</span>;
        }

        if (roles.length === 1) {
          return (
            <Badge variant="outline" className="text-xs">
              {roles[0]}
            </Badge>
          );
        }

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Badge variant="outline" className="text-xs">
                    {roles[0]}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-200 text-gray-600"
                  >
                    +{roles.length - 1}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div className="font-medium text-xs">All Roles:</div>
                  {roles.map((role, index) => (
                    <div key={index} className="text-xs">
                      {role}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "userStatus",
      header: "User Status",
      cell: ({ row }) => {
        const status = row.getValue("userStatus") as string;

        const getStatusConfig = (status: string) => {
          switch (status) {
            case "CONFIRMED":
              return {
                label: "Confirmed",
                className: "bg-green-100 text-green-800",
              };
            case "UNCONFIRMED":
              return {
                label: "Unconfirmed",
                className: "bg-yellow-100 text-yellow-800",
              };
            case "ARCHIVED":
              return {
                label: "Archived",
                className: "bg-gray-100 text-gray-600",
              };
            case "COMPROMISED":
              return {
                label: "Compromised",
                className: "bg-red-100 text-red-800",
              };
            default:
              return {
                label: status || "Unknown",
                className: "bg-gray-100 text-gray-600",
              };
          }
        };

        const config = getStatusConfig(status);

        return (
          <Badge variant="secondary" className={`text-xs ${config.className}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-medium hover:bg-transparent"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        const createdAt = user.createdAt;
        const updatedAt = user.updatedAt;
        const createdBy = user.createdBy || "System";

        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {createdAt ? format(new Date(createdAt), "MMM d, yyyy") : "N/A"}
              </span>
              <Badge variant="outline" className="text-xs">
                {createdBy}
              </Badge>
            </div>
            {updatedAt && updatedAt !== createdAt && (
              <div className="text-xs text-gray-400">
                Updated: {format(new Date(updatedAt), "MMM d, yyyy")}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const isDeleted = user.deleteStatus.isDeleted;
        const isUnverified = user.userStatus !== "CONFIRMED";

        return (
          <div className="flex items-center space-x-1">
            {/* Delete/Restore */}
            {isDeleted ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onRestore(user.userId);
                }}
                title="Restore User"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onDelete(user.userId);
                }}
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {/* Verify (only if unverified) */}
            {!isDeleted && isUnverified && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onVerify(user.userId);
                }}
                title="Verify User"
              >
                <UserCheck className="h-4 w-4" />
              </Button>
            )}

            {/* More Actions Dropdown */}
            {!isDeleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      actions.onUpdateRole(user.userId, user.roles || ["USER"])
                    }
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Update Role
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => actions.onUpdateStatus(user.userId)}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Update Status
                  </DropdownMenuItem>

                  {/* Only show Update KYC if KYC is not already verified (boolean) */}
                  {!user.kycVerified && (
                    <DropdownMenuItem
                      onClick={() => actions.onVerifyKyc(user.userId)}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Update KYC
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() =>
                      actions.onUpdateFraudRisk(user.userId, user.fraudRisk)
                    }
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Update Fraud Risk
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ];
}
