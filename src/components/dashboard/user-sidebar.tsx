'use client'

import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/shared/logo"
import { usePathname } from 'next/navigation'
import { BarChart, Bot, Crosshair, FileText, Globe, Home, Settings } from "lucide-react"
import Link from "next/link"

const menuGroups = [
  {
    items: [
      { href: "/dashboard", label: "Visão Geral", icon: Home },
      { href: "/dashboard/analytics", label: "Análises", icon: BarChart },
      { href: "/dashboard/projects", label: "Meus Sites", icon: Globe },
    ]
  },
  {
    items: [
      { href: "/dashboard/analysis", label: "Análise SWOT de IA", icon: Bot },
      { href: "/dashboard/reports", label: "Relatórios de IA", icon: FileText },
    ]
  },
  {
    items: [
      { href: "/dashboard/settings", label: "Configurações", icon: Settings },
      { href: "/dashboard/diagnostics", label: "Diagnósticos", icon: Crosshair },
    ]
  }
];

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className='px-4 pt-6 pb-2'>
        <Logo href="/dashboard" />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.items.map(({ href, label, icon: Icon }) => (
                 <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={href === '/dashboard' ? pathname === href : pathname.startsWith(href)}
                      tooltip={{ children: label }}
                      className="hover:bg-transparent text-muted-foreground hover:text-foreground data-[active=true]:bg-transparent data-[active=true]:text-foreground data-[active=true]:font-semibold"
                    >
                      <Link href={href}>
                        <Icon className="h-5 w-5" />
                        <span className="text-base">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {groupIndex < menuGroups.length - 1 && <SidebarSeparator className="my-3 bg-transparent" />}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
