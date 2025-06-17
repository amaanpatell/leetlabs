import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChartIcon,
  FilePen,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { useAuthStore } from "@/store/useAuthStore";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Problems",
      url: "/",
      icon: ListIcon,
    },
    {
      title: "Explore",
      url: "/explore",
      icon: SearchIcon,
    },
    {
      title: "Interview",
      url: "/interview",
      icon: UsersIcon,
    },
    {
      title: "Playlist",
      url: "/analytics",
      icon: BarChartIcon,
    },
  ],
  documents: [
    {
      name: "Create Problem",
      url: "/add-problem",
      icon: FilePen,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { authUser } = useAuthStore();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <IconInnerShadowTop className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc.</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {authUser?.role === "ADMIN" && <NavDocuments items={data.documents} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
