import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { CheckSquare, Briefcase, BarChart3, ShieldCheck, ArrowRight, Zap, Users, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 lg:px-12 h-16 flex items-center border-b border-border bg-background sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 transition-transform hover:scale-105" href="#">
          <div className="p-1.5 rounded-md border border-border bg-foreground text-background">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">OpsForge</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <ThemeToggle />
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block" href="#how-it-works">
            How it works
          </Link>
          <div className="w-px h-4 bg-border hidden md:block"></div>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-md px-5")}>
            Login
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "rounded-md px-6 transition-all")}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full py-24 md:py-32 overflow-hidden border-b border-border">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium">
                OpsForge 1.0 is now live
              </div>
              
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Master your project operations
              </h1>
              
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                The all-in-one internal platform for modern engineering teams. Manage sprints, track bugs, and visualize velocity from one centralized command center.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-6">
                <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-md px-8 text-base h-12")}>
                  Start Building Free
                </Link>
                <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-md px-8 text-base h-12")}>
                  Explore Features
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* FEATURES SECTION */}
        <section id="features" className="w-full py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to ship faster</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">OpsForge replaces your scattered toolchain with one unified interface built specifically for software teams.</p>
            </div>
            
            <div className="grid max-w-5xl mx-auto items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kanban Workflows</h3>
                <p className="text-muted-foreground leading-relaxed">Drag and drop your way to success. Visualize bottlenecks and move tasks seamlessly across dynamic project boards.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rich Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Gain immediate insights into team velocity, project completion rates, and historical performance tracking.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed">Role-based access control built directly into the database. Granular permissions for admins, managers, and developers.</p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Issue Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">Log bugs, assign severities, and track resolutions with a dedicated issue tracker linked directly to your projects.</p>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">Create teams, assign project managers, and keep everyone aligned with real-time notifications and updates.</p>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border mb-6">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Built on Next.js 14 and Supabase for an incredibly snappy, optimistic UI experience that never keeps you waiting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-24 md:py-32 border-t border-border">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to transform your workflow?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mb-8">
              Join the engineering teams already using OpsForge to ship better software, faster.
            </p>
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-md px-8 text-base h-12")}>
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t border-border bg-background">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-sm border border-border bg-foreground text-background">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">OpsForge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpsForge Inc. All rights reserved. Built for developers.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
