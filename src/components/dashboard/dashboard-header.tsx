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
import { Home, Settings, User, Bell, LogOutIcon, Sparkles, Megaphone, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { clearSessionCookie, type MockUser } from "@/app/actions/auth"
import { cn } from "@/lib/utils"
import { getNotificationsForUserAction } from "@/app/actions/projects"
import { useToast } from "@/hooks/use-toast"

const alertConfig = {
    info: { icon: Megaphone, iconClassName: 'text-yellow-400' },
    promo: { icon: Sparkles, iconClassName: 'text-primary' },
    critical: { icon: AlertTriangle, iconClassName: 'text-destructive' },
};

interface DashboardHeaderProps {
  user: MockUser | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const pathSegments = pathname.split('/').filter(Boolean);
  const { toast } = useToast();
  
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [isNotifLoading, setIsNotifLoading] = React.useState(false);

  const handleSignOut = async () => {
    await clearSessionCookie();
    router.push('/login');
  }
  
  const fetchNotifications = async () => {
      setIsNotifLoading(true);
      try {
          const result = await getNotificationsForUserAction();
          setNotifications(result);
      } catch (error: any) {
          toast({ title: 'Erro', description: 'Não foi possível carregar as notificações.' });
      } finally {
          setIsNotifLoading(false);
      }
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
        <DropdownMenu onOpenChange={(open) => { if (open) fetchNotifications()}}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Alternar notificações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isNotifLoading ? <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin"/></div> :
            notifications.length > 0 ? notifications.map(alert => {
              const config = alertConfig[alert.type as keyof typeof alertConfig] || alertConfig.info;
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
