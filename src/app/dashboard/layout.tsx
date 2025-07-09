import * as React from 'react'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { UserSidebar } from '@/components/dashboard/user-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Sparkles, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// In a real app, this would be fetched from the database for the logged-in user.
// The admin panel would control these alerts.
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
      cta: null,
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
    info: {
        icon: Megaphone,
        className: 'border-yellow-500/50',
        titleClassName: 'text-yellow-400',
        iconClassName: 'text-yellow-500',
    },
    promo: {
        icon: Sparkles,
        className: 'border-primary/50',
        titleClassName: 'text-primary',
        iconClassName: 'text-primary',
    },
    critical: {
        icon: AlertTriangle,
        variant: 'destructive',
    },
};

const UserAlert = ({ alert }: { alert: typeof userAlerts[0] }) => {
    // @ts-ignore
    const config = alertConfig[alert.type] || alertConfig.info;
    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className={config.className}>
           <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center">
                 <Icon className={`h-4 w-4 ${config.iconClassName}`} />
                 <div className="ml-4">
                   <AlertTitle className={config.titleClassName}>{alert.title}</AlertTitle>
                   <AlertDescription>
                     {alert.description}
                   </AlertDescription>
                 </div>
              </div>
              {alert.cta && (
                 <Button asChild>
                    <Link href={alert.cta.href}>{alert.cta.text}</Link>
                 </Button>
              )}
           </div>
        </Alert>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
            <DashboardHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 mb-6">
                    {userAlerts.map(alert => (
                        <UserAlert key={alert.id} alert={alert} />
                    ))}
                </div>
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}
