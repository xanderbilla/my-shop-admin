"use client";

import { Bell, LogOut, BadgeCheck, XCircle, Clock } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMe } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, error, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const status = error.response?.status;
      // Redirect to login for 401 (Unauthorized) or 503 (Service Unavailable) errors
      if (status === 401 || status === 503) {
        router.push("/login");
      }
    }
  }, [error, router]);

  const userInfo = data?.data?.data;

  const handleLogout = () => {
    // Clear any stored tokens/auth data
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <BadgeCheck className="h-3 w-3 text-green-600" />;
      case "PENDING":
        return <Clock className="h-3 w-3 text-yellow-600" />;
      case "DISABLED":
        return <XCircle className="h-3 w-3 text-red-600" />;
      default:
        return <BadgeCheck className="h-3 w-3 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="animate-pulse flex space-x-3">
              <div className="rounded-full bg-gray-300 h-8 w-8"></div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-300 rounded w-20"></div>
                <div className="h-2 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const user = {
    name: userInfo?.name || "Admin",
    email: userInfo?.email || "admin@example.com",
    avatar: "/avatars/shadcn.jpg",
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus:outline-none focus:ring-0"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="truncate font-semibold">{user.name}</span>
                    {getStatusIcon(userInfo?.userStatus || "CONFIRMED")}
                  </div>
                  <span className="truncate text-xs">{user.email}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userInfo?.roles?.[0] || "ADMIN"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
