import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { CheckSquare, Briefcase, BarChart3, ShieldCheck, ArrowRight, Zap, Users, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      <header className="px-6 lg:px-12 h-16 flex items-center border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 bg-[#0f172a] text-slate-50">
        <Link className="flex items-center justify-center gap-2 transition-transform hover:scale-105" href="#">
          <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">OpsForge</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <ThemeToggle />
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block" href="#how-it-works">
            How it works
          </Link>
          <div className="w-px h-4 bg-slate-700 hidden md:block"></div>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-5 border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-white bg-transparent")}>
            Login
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all")}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 mr-2.5 shadow-[0_0_8px_2px_rgba(16,185,129,0.6)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
                OpsForge 1.0 is now live
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">project operations</span>
              </h1>
              
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                The all-in-one internal platform for modern engineering teams. Manage sprints, track bugs, and visualize velocity from one centralized command center.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 text-base h-12")}>
                  Start Building Free
                </Link>
                <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8 text-base h-12 bg-background/50 backdrop-blur-sm")}>
                  Explore Features
                </Link>
              </div>
            </div>

          </div>
        </section>
        
        {/* FEATURES SECTION */}
        <section id="features" className="w-full py-20 md:py-32 bg-muted/30 border-y">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to ship faster</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">OpsForge replaces your scattered toolchain with one unified interface built specifically for software teams.</p>
            </div>
            
            <div className="grid max-w-5xl mx-auto items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-6 transition-colors group-hover:bg-primary/20">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Kanban Workflows</h3>
                <p className="text-muted-foreground leading-relaxed">Drag and drop your way to success. Visualize bottlenecks and move tasks seamlessly across dynamic project boards.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 mb-6 transition-colors group-hover:bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rich Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Gain immediate insights into team velocity, project completion rates, and historical performance tracking.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 mb-6 transition-colors group-hover:bg-green-500/20">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed">Role-based access control built directly into the database. Granular permissions for admins, managers, and developers.</p>
              </div>

              {/* Feature 4 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 mb-6 transition-colors group-hover:bg-purple-500/20">
                  <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Issue Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">Log bugs, assign severities, and track resolutions with a dedicated issue tracker linked directly to your projects.</p>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 mb-6 transition-colors group-hover:bg-orange-500/20">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">Create teams, assign project managers, and keep everyone aligned with real-time notifications and updates.</p>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 mb-6 transition-colors group-hover:bg-pink-500/20">
                  <Zap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Built on Next.js 14 and Supabase for an incredibly snappy, optimistic UI experience that never keeps you waiting.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/5"></div>
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to transform your workflow?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mb-8">
              Join the engineering teams already using OpsForge to ship better software, faster.
            </p>
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 text-base h-12 shadow-lg shadow-primary/25")}>
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t bg-background">
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
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
