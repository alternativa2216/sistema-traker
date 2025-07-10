import * as React from 'react'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header' 
import { getCurrentUser } from '../actions/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  // Middleware should handle this, but an extra layer of protection is good.
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            <DashboardHeader user={user} />
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  )
}
