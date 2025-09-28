"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Update Roles Dialog
interface UpdateRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRoles: string[];
  onUpdate: (roles: string[]) => void;
  isLoading?: boolean;
}

export function UpdateRolesDialog({
  open,
  onOpenChange,
  currentRoles,
  onUpdate,
  isLoading = false,
}: UpdateRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] =
    React.useState<string[]>(currentRoles);

  const availableRoles = ["USER", "ADMIN", "SUPPORT", "MODERATOR", "MANAGER"];

  React.useEffect(() => {
    setSelectedRoles(currentRoles);
  }, [currentRoles, open]);

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = () => {
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }
    onUpdate(selectedRoles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Roles</DialogTitle>
          <DialogDescription>
            Select the roles you want to assign to this user. Multiple roles can
            be selected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            {availableRoles.map((role) => (
              <div key={role} className="flex items-center space-x-3">
                <Checkbox
                  id={role}
                  checked={selectedRoles.includes(role)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <label
                  htmlFor={role}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role}
                </label>
              </div>
            ))}
          </div>

          {selectedRoles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Selected roles:</p>
              <div className="flex flex-wrap gap-1">
                {selectedRoles.map((role) => (
                  <Badge key={role} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || selectedRoles.length === 0}
          >
            {isLoading ? "Updating..." : "Update Roles"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Update Fraud Risk Dialog
interface UpdateFraudRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRisk: string;
  onUpdate: (risk: string) => void;
  isLoading?: boolean;
}

export function UpdateFraudRiskDialog({
  open,
  onOpenChange,
  currentRisk,
  onUpdate,
  isLoading = false,
}: UpdateFraudRiskDialogProps) {
  const [selectedRisk, setSelectedRisk] = React.useState(currentRisk);

  const riskLevels = [
    { value: "LOW", label: "Low Risk", color: "text-green-600" },
    { value: "MEDIUM", label: "Medium Risk", color: "text-yellow-600" },
    { value: "HIGH", label: "High Risk", color: "text-red-600" },
    { value: "CRITICAL", label: "Critical Risk", color: "text-red-800" },
  ];

  React.useEffect(() => {
    setSelectedRisk(currentRisk);
  }, [currentRisk, open]);

  const handleSubmit = () => {
    if (!selectedRisk) {
      toast.error("Please select a fraud risk level");
      return;
    }
    onUpdate(selectedRisk);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Fraud Risk Level</DialogTitle>
          <DialogDescription>
            Select the appropriate fraud risk level for this user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Select fraud risk level" />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <span className={level.color}>{level.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRisk && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Selected risk level:{" "}
                <span className="font-medium">
                  {riskLevels.find((r) => r.value === selectedRisk)?.label}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedRisk}
          >
            {isLoading ? "Updating..." : "Update Risk Level"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Update Status Dialog
interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;
  onUpdate: (status: string) => void;
  isLoading?: boolean;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onUpdate,
  isLoading = false,
}: UpdateStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = React.useState(currentStatus);

  const statusOptions = [
    { value: "CONFIRMED", label: "Confirmed", color: "text-green-600" },
    { value: "UNCONFIRMED", label: "Unconfirmed", color: "text-yellow-600" },
    { value: "ARCHIVED", label: "Archived", color: "text-gray-600" },
    { value: "COMPROMISED", label: "Compromised", color: "text-red-600" },
    {
      value: "RESET_REQUIRED",
      label: "Reset Required",
      color: "text-orange-600",
    },
    {
      value: "FORCE_CHANGE_PASSWORD",
      label: "Force Change Password",
      color: "text-purple-600",
    },
  ];

  React.useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus, open]);

  const handleSubmit = () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }
    onUpdate(selectedStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Status</DialogTitle>
          <DialogDescription>
            Select the new status for this user account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select user status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <span className={status.color}>{status.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStatus && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Selected status:{" "}
                <span className="font-medium">
                  {statusOptions.find((s) => s.value === selectedStatus)?.label}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedStatus}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
