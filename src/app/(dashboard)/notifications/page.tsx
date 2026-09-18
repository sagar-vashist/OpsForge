import { getGlobalNotifications } from '@/app/actions/activity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Activity } from 'lucide-react'

export default async function NotificationsPage() {
  const notifications = await getGlobalNotifications()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Notifications</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Global Activity (Last 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity logged in the system.</p>
            ) : (
              notifications.map((notification: any) => (
                <div key={notification.id} className="flex items-start gap-4 p-4 rounded-xl bg-[#0f172a] border border-slate-800 shadow-md transition-all hover:border-slate-700 hover:shadow-lg">
                  <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white tracking-tight">{notification.action}</p>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">{notification.details?.message}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                        {new Date(notification.created_at).toLocaleString(undefined, { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </p>
                      {notification.user && (
                        <p className="text-[11px] text-slate-400 font-medium">
                          by {notification.user.first_name} {notification.user.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
