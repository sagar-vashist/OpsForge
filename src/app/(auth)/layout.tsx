import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">OpsForge</h1>
          <p className="text-muted-foreground mt-2">Project & Software Operations Platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}
