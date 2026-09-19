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
    <div className="hidden bg-background md:block md:w-64 lg:w-72 flex-shrink-0 min-h-screen border-r border-border">
      <div className="flex h-16 items-center border-b border-border bg-background px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:scale-105 transition-transform">
          <div className="bg-foreground p-1.5 rounded-md border border-border">
            <Briefcase className="h-5 w-5 text-background" />
          </div>
          <span className="text-foreground">OpsForge</span>
        </Link>
      </div>
      <div className="flex-1 py-6 h-[calc(100vh-4rem)]">
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
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-foreground" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
