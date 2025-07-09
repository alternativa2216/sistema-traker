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
import { Home, Settings, User, Bell, LogOutIcon, Sparkles, Megaphone, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { usePathname, useParams, useRouter } from 'next/navigation'
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { clearSessionCookie } from "@/app/actions/auth"
import type { DecodedIdToken } from "firebase-admin/auth"
import { cn } from "@/lib/utils"

// In a real app, this would be fetched from the database for the logged-in user.
const userAlerts = [
    { 
      id: 'trial',
      type: 'promo', // 'info', 'promo', 'critical'
      title: 'Bem-vindo ao seu Teste Pro!', 
      description: 'Você tem 7 dias restantes para explorar todas as funcionalidades do plano Pro gratuitamente. Aproveite ao máximo!',
      cta: null,
    },
    { 
      id: 'admin_message',
      type: 'info',
      title: 'Aviso do Administrador',
      description: 'Sua fatura de Julho está pendente. Por favor, regularize.',
      cta: {
        text: 'Ver Fatura',
        href: '/dashboard/billing'
      }
    },
    { 
      id: 'payment_due',
      type: 'critical',
      title: 'Pagamento Pendente',
      description: 'Sua fatura está aguardando pagamento para garantir a continuidade dos serviços Pro.',
      cta: {
        text: 'Pagar Agora',
        href: '/dashboard/billing'
      }
    },
];

const alertConfig = {
    info: { icon: Megaphone, iconClassName: 'text-yellow-400' },
    promo: { icon: Sparkles, iconClassName: 'text-primary' },
    critical: { icon: AlertTriangle, iconClassName: 'text-destructive' },
};

interface DashboardHeaderProps {
  user: DecodedIdToken | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const pathSegments = pathname.split('/').filter(Boolean)

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
    await clearSessionCookie();
    router.push('/');
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'UA';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

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
              {userAlerts.length > 0 && (
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              )}
              <span className="sr-only">Alternar notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userAlerts.length > 0 ? userAlerts.map(alert => {
              // @ts-ignore
              const config = alertConfig[alert.type] || alertConfig.info;
              const Icon = config.icon;

              const content = (
                <div className={cn("flex items-start gap-3 p-2 w-full", alert.type === 'critical' ? "bg-destructive/10" : "")}>
                  <div className="mt-1">
                    <Icon className={cn("h-4 w-4", config.iconClassName)} />
                  </div>
                  <div className="flex-1 whitespace-normal">
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
              );

              return (
                <DropdownMenuItem key={alert.id} asChild className="cursor-pointer p-0">
                  {alert.cta ? (
                    <Link href={alert.cta.href}>
                      {content}
                    </Link>
                  ) : (
                    <div>{content}</div>
                  )}
                </DropdownMenuItem>
              )
            }) : (
              <p className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação nova.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user?.picture} alt="User avatar" />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-medium">{user?.name || 'Usuário'}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2"><Settings className="h-4 w-4" /> Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
