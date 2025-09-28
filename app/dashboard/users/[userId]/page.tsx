"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Copy,
  BadgeCheck,
  FileText,
  Settings,
  User as UserIcon,
  MapPin,
} from "lucide-react";
import { useUser, useUpdateDefaultAddress } from "@/hooks/use-users";
import { format } from "date-fns";
import { toast } from "sonner";
import { Address } from "@/types/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [activeTab, setActiveTab] = useState("preferences");
  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data, isLoading, error } = useUser(userId);
  const user = data?.data;
  const updateDefaultAddress = useUpdateDefaultAddress();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleAddressClick = (address: {
    id: string;
    title: string;
    isDefault: boolean;
  }) => {
    if (!address.isDefault) {
      setSelectedAddress({ id: address.id, title: address.title });
    }
  };

  const handleConfirmDefaultAddress = () => {
    if (selectedAddress) {
      updateDefaultAddress.mutate(
        { userId, addressId: selectedAddress.id },
        {
          onSuccess: () => {
            setSelectedAddress(null);
          },
        }
      );
    }
  };

  const tabs = [
    { id: "preferences", label: "Preferences" },
    { id: "address", label: "Address" },
    { id: "statistics", label: "Statistics" },
  ];

  if (isLoading) {
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
                      <BreadcrumbLink href="/dashboard/users">
                        Users
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>User Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="text-center">Loading user details...</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    );
  }

  if (error || !user) {
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
                      <BreadcrumbLink href="/dashboard/users">
                        Users
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>User Details</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="text-center text-red-500">
                Error loading user details
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
                    <BreadcrumbLink href="/dashboard/users">
                      Users
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>User Details</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col">
            {/* Fixed Header Section */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="p-6 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>

                {/* User Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{user.custName}</h1>
                    {user.userStatus === "CONFIRMED" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <BadgeCheck className="h-5 w-5 text-green-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {!user.deleteStatus.isDeleted && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        ACTIVE
                      </Badge>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="relative">
                            <FileText className="h-5 w-5 text-blue-600" />
                            {user.kycVerified && (
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-600 rounded-full flex items-center justify-center">
                                <BadgeCheck className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            KYC Status:{" "}
                            {user.kycVerified ? "Verified" : "Not Verified"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Settings className="h-5 w-5 text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>User Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Roles and Last Login */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {user.roles.length === 1 ? (
                      <Badge variant="outline" className="text-xs">
                        {user.roles[0]}
                      </Badge>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 cursor-help">
                              <Badge variant="outline" className="text-xs">
                                {user.roles[0]}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gray-200 text-gray-600"
                              >
                                +{user.roles.length - 1}
                              </Badge>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div className="font-medium text-xs">
                                All Roles:
                              </div>
                              {user.roles.map((role: string, index: number) => (
                                <div key={index} className="text-xs">
                                  {role}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Last login:{" "}
                    {user.lastLogin
                      ? format(
                          new Date(user.lastLogin),
                          "MMM d, yyyy 'at' h:mm a"
                        )
                      : "Never"}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Side - Avatar and Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={user.profilePicture || undefined}
                          alt={user.custName}
                        />
                        <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                          {user.custName ? (
                            user.custName.charAt(0).toUpperCase()
                          ) : (
                            <UserIcon className="h-8 w-8" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">
                            User ID:
                          </span>
                          <span className="font-mono text-sm">
                            {user.userId.slice(-6).toUpperCase()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                            onClick={() => copyToClipboard(user.userId)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-medium">
                            Username:
                          </span>
                          <span className="ml-2 text-sm">{user.username}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600 font-medium">
                            Email:
                          </span>
                          <span className="ml-2 text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div>
                            <span className="text-sm text-gray-600 font-medium">
                              Phone:
                            </span>
                            <span className="ml-2 text-sm">{user.phone}</span>
                          </div>
                        )}
                        {user.gender && (
                          <div>
                            <span className="text-sm text-gray-600 font-medium">
                              Gender:
                            </span>
                            <span className="ml-2 text-sm">{user.gender}</span>
                          </div>
                        )}
                        {user.deleteStatus.restoresCount > 0 && (
                          <div>
                            <span className="text-sm text-gray-600 font-medium">
                              Restore Count:
                            </span>
                            <span className="ml-2 text-sm">
                              {user.deleteStatus.restoresCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Tabs */}
                  <div className="lg:col-span-2">
                    {/* Custom Tabs */}
                    <div className="border-b mb-6">
                      <div className="flex space-x-8">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                      {activeTab === "preferences" && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between py-4 border-b">
                            <div>
                              <h3 className="font-medium">Newsletter</h3>
                              <p className="text-sm text-gray-600">
                                Receive updates about new products and features
                              </p>
                            </div>
                            <Switch
                              checked={user.preferences.newsletter}
                              onCheckedChange={(checked) => {
                                // Handle newsletter toggle
                                console.log("Newsletter:", checked);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between py-4 border-b">
                            <div>
                              <h3 className="font-medium">Notifications</h3>
                              <p className="text-sm text-gray-600">
                                Get notified about important account updates
                              </p>
                            </div>
                            <Switch
                              checked={user.preferences.notifications}
                              onCheckedChange={(checked) => {
                                // Handle notifications toggle
                                console.log("Notifications:", checked);
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between py-4 border-b">
                            <div>
                              <h3 className="font-medium">Language</h3>
                            </div>
                            <Select defaultValue={user.preferences.language}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between py-4">
                            <div>
                              <h3 className="font-medium">Currency</h3>
                            </div>
                            <Select defaultValue={user.preferences.currency}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="JPY">JPY</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {activeTab === "address" && (
                        <div className="space-y-4">
                          {user.addresses && user.addresses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {user.addresses.map((address: Address) => (
                                <div
                                  key={address.id}
                                  className="relative border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => handleAddressClick(address)}
                                >
                                  {/* Type badge in top right corner */}
                                  <div className="absolute top-2 right-2">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {address.type}
                                    </span>
                                  </div>

                                  {/* Address content */}
                                  <div className="space-y-2 pr-16">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium text-gray-900">
                                        {address.title}
                                      </h3>
                                      {address.isDefault && (
                                        <Badge
                                          variant="default"
                                          className="text-xs"
                                        >
                                          Default
                                        </Badge>
                                      )}
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-1">
                                      <div>{address.street}</div>
                                      <div>
                                        {address.city}, {address.state}{" "}
                                        {address.zipCode}
                                      </div>
                                      <div>{address.country}</div>
                                    </div>
                                  </div>

                                  {/* Location icon */}
                                  {address.coordinates &&
                                    address.coordinates.lat &&
                                    address.coordinates.lng && (
                                      <div className="absolute bottom-4 right-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const url = `https://www.google.com/maps?q=${
                                              address.coordinates!.lat
                                            },${address.coordinates!.lng}`;
                                            window.open(url, "_blank");
                                          }}
                                        >
                                          <MapPin className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Addresses
                              </h3>
                              <p className="text-gray-600">
                                This user has not added any addresses yet.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "statistics" && (
                        <div className="space-y-6">
                          {user.accountStats ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-600">
                                  {user.accountStats.totalOrders}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">
                                  Total Orders
                                </div>
                              </div>

                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">
                                  ${user.accountStats.totalSpent.toFixed(2)}
                                </div>
                                <div className="text-sm text-green-600 font-medium">
                                  Total Spent
                                </div>
                              </div>

                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-600">
                                  {user.accountStats.wishlistCount}
                                </div>
                                <div className="text-sm text-purple-600 font-medium">
                                  Wishlist Items
                                </div>
                              </div>

                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="text-2xl font-bold text-orange-600">
                                  {user.accountStats.favoriteCategories.length}
                                </div>
                                <div className="text-sm text-orange-600 font-medium">
                                  Favorite Categories
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Statistics Available
                              </h3>
                              <p className="text-gray-600">
                                Account statistics are not available for this
                                user.
                              </p>
                            </div>
                          )}

                          {/* Favorite Categories */}
                          {user.accountStats &&
                            user.accountStats.favoriteCategories.length > 0 && (
                              <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                  Favorite Categories
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {user.accountStats.favoriteCategories.map(
                                    (category, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-sm"
                                      >
                                        {category as string}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Order History Section */}
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Order History
                      </h3>
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <h4 className="text-md font-medium text-gray-700 mb-2">
                          Coming Soon
                        </h4>
                        <p className="text-sm text-gray-600">
                          Order history functionality is under development and
                          will be available soon.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>

        {/* Default Address Confirmation Dialog */}
        <AlertDialog
          open={selectedAddress !== null}
          onOpenChange={() => setSelectedAddress(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Set Default Address</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to set &ldquo;{selectedAddress?.title}
                &rdquo; as the default address for this user?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedAddress(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDefaultAddress}
                disabled={updateDefaultAddress.isPending}
              >
                {updateDefaultAddress.isPending ? "Setting..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarProvider>
    </AuthGuard>
  );
}
