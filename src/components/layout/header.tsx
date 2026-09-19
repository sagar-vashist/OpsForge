'use client'

import { Bell, Menu, Search, User, Briefcase } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
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
    <header className="flex h-16 items-center gap-4 bg-background text-foreground px-4 lg:px-8 sticky top-0 z-10 border-b border-border">
      <Sheet>
        <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "shrink-0 md:hidden text-muted-foreground hover:text-foreground" })}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-background text-foreground border-r border-border">
          <div className="font-bold text-lg mb-4 flex items-center gap-2">
            <div className="bg-foreground p-1.5 rounded-md text-background">
              <Briefcase className="h-5 w-5" />
            </div>
            OpsForge
          </div>
          <div className="flex flex-col space-y-3">
             <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
             <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</Link>
             <Link href="/tasks" className="text-muted-foreground hover:text-foreground transition-colors">Tasks</Link>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1 flex justify-center">
        <form action="/projects" method="GET" className="w-full max-w-md">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <Input
              type="search"
              name="q"
              placeholder="Search Projects...."
              className="w-full appearance-none bg-background border-border text-foreground placeholder:text-muted-foreground pl-10 py-5 rounded-md focus-visible:ring-1 focus-visible:ring-foreground transition-all"
            />
          </div>
        </form>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/notifications" className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-foreground border border-background"></span>
          <span className="sr-only">Toggle notifications</span>
        </Link>
        
        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-md bg-muted border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors outline-none focus:ring-1 focus:ring-foreground">
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
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
