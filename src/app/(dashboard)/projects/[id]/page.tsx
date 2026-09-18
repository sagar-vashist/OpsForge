import { getProject } from '@/app/actions/projects'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Calendar, CheckSquare, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { getTasks } from '@/app/actions/tasks'

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  
  if (!project) {
    notFound()
  }

  // Fetch tasks for this project
  const tasks = await getTasks(project.id)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Briefcase className="h-4 w-4" /> Code: {project.project_code}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {project.status === 'COMPLETED' && (
            <form action={async () => {
              'use server'
              const { deleteProject } = await import('@/app/actions/projects')
              await deleteProject(project.id)
              const { redirect } = await import('next/navigation')
              redirect('/projects')
            }}>
              <Button type="submit" variant="destructive" size="sm">
                Delete Project
              </Button>
            </form>
          )}
          <Link href={`/projects/${project.id}/edit`} className={buttonVariants({ variant: "secondary" })}>
            Edit Project
          </Link>
          <Link href={`/kanban?project=${project.id}`} className={buttonVariants({ variant: "outline" })}>
            View Board
          </Link>
          <Link href={`/tasks/new?project=${project.id}`} className={buttonVariants({ variant: "default" })}>
            New Task
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={project.status === 'COMPLETED' ? 'completed' : project.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={project.priority ? project.priority.toLowerCase() as any : 'outline'}>
              {project.priority}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manager</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {project.manager ? `${project.manager.first_name} ${project.manager.last_name}` : 'Unassigned'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {project.description || 'No description provided.'}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest tasks assigned to this project.</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.status}</p>
                    </div>
                    <Badge variant={task.priority ? task.priority.toLowerCase() as any : 'outline'}>{task.priority}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tasks found for this project.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
