import * as React from "react";
import { IconInnerShadowTop, IconPlaylist, IconPlaylistAdd } from "@tabler/icons-react";

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
  Code,
  FilePen,
  LayoutDashboardIcon,
  ListIcon,
  UsersIcon,
} from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Problems",
      url: "/problem",
      icon: ListIcon,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UsersIcon,
    },
    {
      title: "Playlist",
      url: "/playlist",
      icon: IconPlaylistAdd,
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
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Code className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">LeetLabs</span>
                  <span className="truncate text-xs">Coding Challenge</span>
                </div>
              </Link>
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
