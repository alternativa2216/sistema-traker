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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, these values would come from your database based on the logged-in user.
  const isPaymentDue = true; 
  const isProTrialActive = true; 
  const trialDaysLeft = 7; 
  const customUserAlert = 'Sua fatura de Julho está pendente. Por favor, regularize.'; // This simulates the custom alert set by the admin.

  return (
    <SidebarProvider>
        <UserSidebar />
        <SidebarInset>
            <DashboardHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                {customUserAlert && (
                     <Alert className="mb-6 border-yellow-500/50">
                       <Megaphone className="h-4 w-4 text-yellow-500" />
                       <div className="ml-4 flex-grow">
                         <AlertTitle className="font-headline text-yellow-400">Aviso do Administrador</AlertTitle>
                         <AlertDescription>
                           {customUserAlert}
                         </AlertDescription>
                       </div>
                    </Alert>
                )}

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
