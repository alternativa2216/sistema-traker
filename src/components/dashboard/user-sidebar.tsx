'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/shared/logo"
import { usePathname } from 'next/navigation'
import { BarChart, Bot, FileText, Home, LifeBuoy, Settings, ShoppingCart, Users } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/analysis", label: "AI SWOT Analysis", icon: Bot },
  { href: "/dashboard/reports", label: "AI Reports", icon: FileText },
  { href: "/dashboard/projects", label: "Projects", icon: Users },
  { href: "/dashboard/billing", label: "Billing", icon: ShoppingCart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/diagnostics", label: "Diagnostics", icon: LifeBuoy },
];

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo href="/dashboard" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === href}
                  tooltip={{ children: label }}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
