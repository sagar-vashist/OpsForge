import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Info } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" /> General Settings
          </CardTitle>
          <CardDescription>Configure your personal preferences and platform settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">Additional configuration options will appear here in future updates.</p>
          
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4 flex items-start gap-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Need Customization?</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200/70 mt-1 leading-relaxed">
                As this platform is currently tailored for your core workflow, some advanced settings are hardcoded. If you require any system modifications, custom integrations, or UI changes, please <strong>Contact the Developer</strong> to deploy an update.
              </p>
              <div className="mt-3">
                <a href="mailto:sagarvashist02@gmail.com" className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-blue-600 text-white hover:bg-blue-700 h-8 px-4 py-2">
                  Contact Developer
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
