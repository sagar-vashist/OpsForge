import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FloatingSupportChat } from '@/components/dashboard/floating-support-chat'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/login')
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-hidden">
        <Header userEmail={user.email} />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/10 relative">
          {children}
        </main>
      </div>
      <FloatingSupportChat />
    </div>
  )
}
