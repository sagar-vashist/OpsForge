"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LifeBuoy, Mail, MessageSquare } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Support & Help</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Live Chat
            </CardTitle>
            <CardDescription>Chat with our AI support bot instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Our OpsForge Assistant is available 24/7 to answer your common questions.</p>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-support-chat'))}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm w-full transition-colors"
            >
              Start Chat
            </button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Email Support
            </CardTitle>
            <CardDescription>Send us an email and we&apos;ll get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">We typically respond to all email inquiries within 24 hours.</p>
            <a 
              href="mailto:sagarvashist02@gmail.com" 
              className="inline-flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#0f172a] dark:text-slate-300 dark:hover:bg-slate-800/80 px-4 py-2 rounded-md font-medium text-sm w-full transition-colors border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              Contact Us
            </a>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5" /> Documentation & FAQs
          </CardTitle>
          <CardDescription>Browse our knowledge base for quick answers.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Coming soon!</p>
        </CardContent>
      </Card>
    </div>
  )
}
