import { getTask } from '@/app/actions/tasks'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, Clock, User, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

export default async function TaskDetailsPage({ params }: { params: { id: string } }) {
  const task = await getTask(params.id)
  
  if (!task) {
    notFound()
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  
  const canEdit = user && (profile?.role === 'ADMIN' || profile?.role === 'PROJECT_MANAGER' || task.reporter_id === user.id || task.assignee_id === user.id)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={task.status === 'COMPLETED' ? 'completed' : task.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
              {task.status}
            </Badge>
            <Badge variant={task.priority ? task.priority.toLowerCase() as any : 'outline'}>
              {task.priority}
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{task.title}</h2>
          {task.project && (
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Briefcase className="h-4 w-4" /> 
              Project: <Link href={`/projects/${task.project_id}`} className="hover:underline text-primary">{task.project.name} ({task.project.project_code})</Link>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {task.status === 'COMPLETED' && (
            <form action={async () => {
              'use server'
              const { deleteTask } = await import('@/app/actions/tasks')
              await deleteTask(task.id)
              const { redirect } = await import('next/navigation')
              redirect('/tasks')
            }}>
              <Button type="submit" variant="destructive" size="sm">
                Delete Task
              </Button>
            </form>
          )}
          {canEdit && (
            <Link href={`/tasks/${task.id}/edit`} className={buttonVariants({ variant: "outline" })}>
              Edit Task
            </Link>
          )}
          <Link href={`/kanban?project=${task.project_id || ''}`} className={buttonVariants({ variant: "outline" })}>
            View on Board
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignee</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reporter</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {task.reporter ? `${task.reporter.first_name} ${task.reporter.last_name}` : 'System'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created At</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(task.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {task.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
