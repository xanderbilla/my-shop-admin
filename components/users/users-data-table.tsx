"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UsersTableFilters } from "@/types/users";
import { createColumns } from "./columns";
import { useRouter } from "next/navigation";

interface UsersDataTableProps {
  data: User[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  filters: UsersTableFilters;
  onFiltersChange: (filters: Partial<UsersTableFilters>) => void;
  onDelete: (userId: string) => void;
  onRestore: (userId: string) => void;
  onVerify: (userId: string) => void;
  onUpdateRole: (userId: string, roles: string[]) => void;
  onVerifyKyc: (userId: string) => void;
  onUpdateFraudRisk: (userId: string, risk: string) => void;
  onUpdateStatus: (userId: string) => void;
  isLoading?: boolean;
}

export function UsersDataTable({
  data,
  totalRecords,
  totalPages,
  currentPage,
  hasNext,
  hasPrevious,
  filters,
  onFiltersChange,
  onDelete,
  onRestore,
  onVerify,
  onUpdateRole,
  onVerifyKyc,
  onUpdateFraudRisk,
  onUpdateStatus,
  isLoading = false,
}: UsersDataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = createColumns({
    onDelete,
    onRestore,
    onVerify,
    onUpdateRole,
    onVerifyKyc,
    onUpdateFraudRisk,
    onUpdateStatus,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    rowCount: totalRecords,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: filters.limit,
      },
    },
  });

  const handleRowClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and monitor all users on the platform
        </p>
      </div>

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Search users..."
              value={filters.query || ""}
              onChange={(event) =>
                onFiltersChange({ query: event.target.value, page: 1 })
              }
              className="pl-9 w-64"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <Select
            value={filters.role || "All"}
            onValueChange={(value) =>
              onFiltersChange({
                role: value === "All" ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPPORT">Support</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.userStatus || "All Status"}
            onValueChange={(value) =>
              onFiltersChange({
                userStatus: value === "All Status" ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="UNCONFIRMED">Unconfirmed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "userId"
                      ? "User ID"
                      : column.id === "custName"
                      ? "User"
                      : column.id === "email"
                      ? "Contact"
                      : column.id === "roles"
                      ? "Roles"
                      : column.id === "userStatus"
                      ? "User Status"
                      : column.id === "createdAt"
                      ? "Created"
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clean Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-gray-50/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-medium text-gray-700 py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton rows for loading state
              Array.from({ length: filters.limit || 10 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isDeleted = row.original.deleteStatus.isDeleted;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`cursor-pointer hover:bg-gray-50/50 border-b border-gray-100 ${
                      isDeleted ? "opacity-50" : ""
                    }`}
                    onClick={(e) => {
                      // Prevent navigation if clicking on checkbox or actions
                      const target = e.target as HTMLElement;
                      const isCheckbox = target.closest('[role="checkbox"]');
                      const isAction =
                        target.closest('[role="menuitem"]') ||
                        target.closest("button");

                      if (!isCheckbox && !isAction) {
                        handleRowClick(row.original.userId);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 whitespace-nowrap min-w-[100px]">
              Rows per page
            </span>
            <Select
              value={filters.limit?.toString() || "10"}
              onValueChange={(value) =>
                onFiltersChange({ limit: parseInt(value), page: 1 })
              }
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center space-x-1">
            {/* First page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: 1 })}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to first page</span>
              &laquo;
            </Button>

            {/* Previous page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: currentPage - 1 })}
              disabled={!hasPrevious}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to previous page</span>
              &lsaquo;
            </Button>

            {/* Page numbers */}
            {(() => {
              const pages = [];
              const showPages = 5; // Number of pages to show around current page
              let startPage = Math.max(
                1,
                currentPage - Math.floor(showPages / 2)
              );
              const endPage = Math.min(totalPages, startPage + showPages - 1);

              // Adjust start if we're near the end
              if (endPage - startPage + 1 < showPages) {
                startPage = Math.max(1, endPage - showPages + 1);
              }

              // Always show first page
              if (startPage > 1) {
                pages.push(
                  <Button
                    key={1}
                    variant={1 === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFiltersChange({ page: 1 })}
                    className="h-8 w-8 p-0"
                  >
                    1
                  </Button>
                );
                if (startPage > 2) {
                  pages.push(
                    <span key="ellipsis1" className="text-gray-400 px-1">
                      ...
                    </span>
                  );
                }
              }

              // Show page numbers
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFiltersChange({ page: i })}
                    className="h-8 w-8 p-0"
                  >
                    {i}
                  </Button>
                );
              }

              // Always show last page
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(
                    <span key="ellipsis2" className="text-gray-400 px-1">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <Button
                    key={totalPages}
                    variant={totalPages === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFiltersChange({ page: totalPages })}
                    className="h-8 w-8 p-0"
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}

            {/* Next page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: currentPage + 1 })}
              disabled={!hasNext}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to next page</span>
              &rsaquo;
            </Button>

            {/* Last page button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({ page: totalPages })}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Go to last page</span>
              &raquo;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
