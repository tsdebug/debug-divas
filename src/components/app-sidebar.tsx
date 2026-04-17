"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UploadIcon,
  ShieldAlertIcon,
  TrendingUpIcon,
  HistoryIcon,
  Settings2Icon,
  CircleHelpIcon,
  FileChartColumnIcon,
  DatabaseIcon,
  FileTextIcon,
  ActivityIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Analyst",
    email: "analyst@finhealth.ai",
    avatar: "/avatars/user.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Upload Data",
      url: "/upload",
      icon: <UploadIcon />,
    },
    {
      title: "Risk Assessment",
      url: "/risk",
      icon: <ShieldAlertIcon />,
    },
    {
      title: "Investment Insights",
      url: "/insights",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Score History",
      url: "/history",
      icon: <HistoryIcon />,
    },
  ],

  documents: [
    {
      name: "Financial Reports",
      url: "/reports",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "SME Data Library",
      url: "/data-library",
      icon: <DatabaseIcon />,
    },
    {
      name: "Score Explanations",
      url: "/explanations",
      icon: <FileTextIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: <CircleHelpIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <ActivityIcon className="size-5!" />
                <span className="text-base font-semibold">FinHealth AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}