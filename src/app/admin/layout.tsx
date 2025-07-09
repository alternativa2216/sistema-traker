import * as React from 'react'
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header' // Re-using header for consistency
import { getCurrentUser } from '../actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  // Add logic here to check if user is an admin
  // if (user.role !== 'admin') { redirect('/dashboard') }

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
