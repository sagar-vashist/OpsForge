'use client'

import { Bell, Menu, Search, User, Briefcase } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header({ userEmail }: { userEmail?: string | null }) {
  const router = useRouter()

  return (
    <header className="flex h-16 items-center gap-4 bg-[#0f172a] text-slate-50 px-4 lg:px-8 sticky top-0 z-10 shadow-md border-b border-slate-800">
      <Sheet>
        <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0 md:hidden text-slate-300 hover:text-white hover:bg-slate-800" })}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-[#0f172a] text-slate-50 border-r-slate-800">
          <div className="font-bold text-lg mb-4 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-md">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            OpsForge
          </div>
          <div className="flex flex-col space-y-3">
             <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
             <Link href="/projects" className="text-slate-300 hover:text-white transition-colors">Projects</Link>
             <Link href="/tasks" className="text-slate-300 hover:text-white transition-colors">Tasks</Link>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1 flex justify-center">
        <form action="/projects" method="GET" className="w-full max-w-md">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
            <Input
              type="search"
              name="q"
              placeholder="Search Projects...."
              className="w-full appearance-none bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 pl-10 py-5 rounded-full focus-visible:ring-primary focus-visible:bg-slate-800 shadow-inner transition-all"
            />
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/notifications" className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0f172a]"></span>
          <span className="sr-only">Toggle notifications</span>
        </Link>
        
        <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-primary-foreground hover:bg-primary/40 transition-colors outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0f172a]">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">My Account</p>
                  <p className="text-xs leading-none text-muted-foreground">{userEmail || 'user@opsforge.io'}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/support')} className="cursor-pointer">Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600 focus:text-red-50 focus:bg-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
