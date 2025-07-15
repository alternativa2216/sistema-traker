'use client'

import * as React from 'react'
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
import { BarChart, Bot, CreditCard, Crosshair, FileText, Globe, Home, Settings } from "lucide-react"
import Link from "next/link"

const menuGroups = [
  {
    label: 'Visão Geral',
    items: [
      { href: "/dashboard", label: "Painel Principal", icon: Home },
      { href: "/dashboard/projects", label: "Meus Sites", icon: Globe },
    ]
  },
  {
    label: 'Ferramentas de IA',
    items: [
      { href: "/dashboard/analysis", label: "Análise SWOT", icon: Bot },
    ]
  },
  {
    label: 'Gerenciamento',
    items: [
      { href: "/dashboard/settings", label: "Configurações", icon: Settings },
      { href: "/dashboard/billing", label: "Faturamento", icon: CreditCard },
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
      <SidebarContent className="p-4">
        <div className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                {group.label}
              </h4>
              <SidebarMenu>
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
              </SidebarMenu>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
