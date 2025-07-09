import * as React from 'react'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { UserSidebar } from '@/components/dashboard/user-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isPaymentDue = true; // Em um app real, isso viria do seu banco de dados
  const isProTrialActive = true; // Simula um usuário em teste
  const trialDaysLeft = 7; // Simula os dias restantes

  return (
    <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
            <DashboardHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                {isProTrialActive && (
                    <Alert className="mb-6 border-primary/50">
                       <Sparkles className="h-4 w-4 text-primary" />
                       <div className="ml-4 flex-grow">
                         <AlertTitle className="font-headline text-primary">Bem-vindo ao seu Teste Pro!</AlertTitle>
                         <AlertDescription>
                           Você tem {trialDaysLeft} dias restantes para explorar todas as funcionalidades do plano Pro gratuitamente. Aproveite ao máximo!
                         </AlertDescription>
                       </div>
                    </Alert>
                )}
                {isPaymentDue && (
                    <Alert variant="destructive" className="mb-6 flex items-center justify-between">
                       <div className="flex items-center">
                         <AlertTriangle className="h-4 w-4" />
                         <div className="ml-4">
                           <AlertTitle>Pagamento Pendente</AlertTitle>
                           <AlertDescription>
                             Sua fatura está aguardando pagamento para garantir a continuidade dos serviços Pro.
                           </AlertDescription>
                         </div>
                       </div>
                       <Button asChild>
                          <Link href="/dashboard/billing">Pagar Agora</Link>
                       </Button>
                    </Alert>
                )}
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}
