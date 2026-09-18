'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, CheckSquare, KanbanSquare, AlertCircle, BarChart3, Users, Settings, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Kanban', href: '/kanban', icon: KanbanSquare },
  { name: 'Issues', href: '/issues', icon: AlertCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden bg-slate-100 dark:bg-[#0f172a] md:block md:w-64 lg:w-72 flex-shrink-0 min-h-screen shadow-[inset_-4px_0_12px_rgba(0,0,0,0.02)] dark:border-r dark:border-slate-800">
      <div className="flex h-16 items-center border-b border-slate-800 bg-[#0f172a] px-4 lg:px-6 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white hover:scale-105 transition-transform">
          <div className="bg-[#1e293b] p-1.5 rounded-md border border-slate-700/50">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-white">OpsForge</span>
        </Link>
      </div>
      <div className="flex-1 py-6 border-r border-slate-200 dark:border-transparent h-[calc(100vh-4rem)]">
        <nav className="grid items-start px-4 text-sm font-medium space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 transition-all font-semibold",
                  isActive 
                    ? "bg-[#0f172a] text-white shadow-md dark:bg-slate-800 dark:border dark:border-slate-700"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/50"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-400" : "text-slate-500 dark:text-slate-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
