"use client";

import * as React from "react";
import {
  AudioWaveform,
  BarChart3,
  Command,
  FileText,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Heart,
  MapPin,
  Grid3x3,
  Image,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "My Shop Admin",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Carousel",
      url: "/dashboard/carousel",
      icon: Image,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Grid3x3,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Carts",
      url: "/dashboard/carts",
      icon: ShoppingCart,
    },
    {
      title: "Wishlist",
      url: "/dashboard/wishlist",
      icon: Heart,
    },
    {
      title: "Tracking",
      url: "/dashboard/tracking",
      icon: MapPin,
    },
  ],
  reports: [
    {
      name: "User Reports",
      url: "/dashboard/reports/users",
      icon: FileText,
    },
    {
      name: "Orders Analytics",
      url: "/dashboard/reports/orders",
      icon: BarChart3,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.reports} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
