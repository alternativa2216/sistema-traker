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
import { BarChart, Bot, CreditCard, FileText, Globe, Home, LifeBuoy, Settings } from "lucide-react"
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
      { href: "/dashboard/billing", label: "Faturamento", icon: CreditCard },
      { href: "/dashboard/settings", label: "Configurações", icon: Settings },
      { href: "/dashboard/diagnostics", label: "Diagnósticos", icon: LifeBuoy },
    ]
  }
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
          {menuGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {group.items.map(({ href, label, icon: Icon }) => (
                 <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={href === '/dashboard' ? pathname === href : pathname.startsWith(href)}
                      tooltip={{ children: label }}
                    >
                      <Link href={href}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {groupIndex < menuGroups.length - 1 && <SidebarSeparator className="my-2" />}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
