import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '@/components/dashboard/overview'
import { Briefcase, CheckSquare, AlertCircle, Clock } from 'lucide-react'
import { getAnalyticsData, getMonthlyVelocity } from '@/app/actions/analytics'
import { getTasks } from '@/app/actions/tasks'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function DashboardPage() {
  const analytics = await getAnalyticsData()
  const recentTasks = await getTasks() // gets all tasks ordered by created_at desc
  const velocityData = await getMonthlyVelocity()

  // Take top 5 recent tasks
  const topTasks = recentTasks?.slice(0, 5) || []

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTasks - analytics.completedTasks}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{analytics.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openIssues}</div>
            <p className="text-xs text-muted-foreground">Unresolved bug reports</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Project Velocity (YTD)</CardTitle>
            <CardDescription>Monthly comparison of completed tasks vs reported issues.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={velocityData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest tasks assigned across projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topTasks.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">No tasks found.</div>
              ) : (
                topTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <Link href={`/tasks/${task.id}`} className="text-sm font-medium leading-none hover:underline">
                        {task.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Project: {task.project?.name || 'Unknown'}
                      </p>
                    </div>
                    <div className="ml-auto">
                       <Badge variant={task.status === 'COMPLETED' ? 'completed' : 'outline'}>{task.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
