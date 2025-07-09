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
import { BarChart, CreditCard, Flag, Gauge, HardDrive, Shield, SlidersHorizontal, Users, LogOut } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { href: "/admin", label: "Painel", icon: Gauge },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/projects", label: "Projetos", icon: BarChart },
  { href: "/admin/subscriptions", label: "Assinaturas", icon: CreditCard },
  { href: "/admin/settings", label: "Configurações da Plataforma", icon: SlidersHorizontal },
  { href: "/admin/feature-flags", label: "Flags de Funcionalidades", icon: Flag },
  { href: "/admin/health", label: "Saúde do Sistema", icon: HardDrive },
  { href: "/admin/security", label: "Segurança", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo href="/admin" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <Link href={href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(href) && (href !== "/admin" || pathname === "/admin")}
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
