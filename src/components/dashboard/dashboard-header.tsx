'use client'

import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Settings, User, Bell, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { usePathname, useParams } from 'next/navigation'

export function DashboardHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)
  const params = useParams() as { siteId?: string };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1">
        <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
          </Link>
          {pathSegments.map((segment, index) => {
            const href = '/' + pathSegments.slice(0, index + 1).join('/')
            const isLast = index === pathSegments.length - 1
            // Do not show a link for [siteId]
            if (segment.startsWith('[') && segment.endsWith(']')) {
                return <span key={href} className="mx-2">/</span>
            }
            return (
              <React.Fragment key={href}>
                <span className="mx-2">/</span>
                <Link
                  href={href}
                  className={`${isLast ? 'text-foreground' : 'hover:text-foreground'}`}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')}
                </Link>
              </React.Fragment>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              <span className="sr-only">Alternar notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/dashboard/sites/${params.siteId || 'site-1'}/cloaker`}
                className="flex items-start gap-3 p-2"
              >
                <div className="mt-1">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 whitespace-normal">
                  <p className="font-semibold">Atividade Suspeita Detectada</p>
                  <p className="text-xs text-muted-foreground">
                    Detectamos bots tentando acessar o site '{params.siteId || 'meu-ecommerce.com'}'. Veja as recomendações no Cloaker.
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="user avatar" />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin" className="flex items-center gap-2"><User className="h-4 w-4" /> Painel do Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
