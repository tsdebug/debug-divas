"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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
  FileChartColumnIcon,
  FileTextIcon,
  ActivityIcon,
} from "lucide-react"
import Link from "next/link"

const data = {
  navMain: [
  { title: "Dashboard",           url: "/dashboard",      icon: <LayoutDashboardIcon /> },
  { title: "Upload Data",         url: "/upload",         icon: <UploadIcon /> },
  { title: "Risk Assessment",     url: "/risk",           icon: <ShieldAlertIcon /> },
  { title: "Investment Insights", url: "/investment",     icon: <TrendingUpIcon /> },
],

  documents: [
    {
      name: "Score Explanations",
      url: "/explanations",
      icon: <FileTextIcon />,
    },
    {
      name: "Financial Reports",
      url: "/reports",
      icon: <FileChartColumnIcon />,
    },
  ],

  navSecondary: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (authUser) {
          const name = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User"
          setUser({
            name,
            email: authUser.email || "user@example.com",
            avatar: "/avatars/user.jpg",
          })
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }

    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <ActivityIcon className="size-5!" />
                <span className="text-base font-semibold">FinHealth AI</span>
              </Link>
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}