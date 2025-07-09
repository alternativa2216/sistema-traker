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
import { CreditCard, FileEdit, Flag, Gauge, Globe, HardDrive, Shield, SlidersHorizontal, Users, ClipboardList, Megaphone } from "lucide-react"
import Link from "next/link"

const menuGroups = [
  {
    label: "Gestão Principal",
    items: [
      { href: "/admin", label: "Painel", icon: Gauge },
      { href: "/admin/users", label: "Usuários", icon: Users },
      { href: "/admin/projects", label: "Sites", icon: Globe },
      { href: "/admin/subscriptions", label: "Assinaturas", icon: CreditCard },
      { href: "/admin/notifications", label: "Notificações", icon: Megaphone },
    ]
  },
  {
    label: "Configuração",
    items: [
      { href: "/admin/content-management", label: "Conteúdo", icon: FileEdit },
      { href: "/admin/settings", label: "Configurações", icon: SlidersHorizontal },
      { href: "/admin/feature-flags", label: "Feature Flags", icon: Flag },
      { href: "/admin/security", label: "Segurança", icon: Shield },
    ]
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/health", label: "Saúde do Sistema", icon: HardDrive },
      { href: "/admin/logs", label: "Logs", icon: ClipboardList },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo href="/admin" />
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
                      isActive={href === '/admin' ? pathname === href : pathname.startsWith(href)}
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
