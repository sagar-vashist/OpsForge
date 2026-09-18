import { getIssue } from '@/app/actions/issues'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Briefcase, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

export default async function IssueDetailsPage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)
  
  if (!issue) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={issue.status === 'RESOLVED' ? 'completed' : issue.status === 'OPEN' ? 'default' : 'secondary'}>
              {issue.status}
            </Badge>
            <Badge variant={issue.priority ? issue.priority.toLowerCase() as any : 'outline'}>
              {issue.priority}
            </Badge>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{issue.title}</h2>
          {issue.project && (
            <p className="text-muted-foreground flex items-center gap-2 mt-2">
              <Briefcase className="h-4 w-4" /> 
              Project: <Link href={`/projects/${issue.project_id}`} className="hover:underline text-primary">{issue.project.name} ({issue.project.project_code})</Link>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {issue.status !== 'RESOLVED' && (
            <form action={async () => {
              'use server'
              const { updateIssueStatus } = await import('@/app/actions/issues')
              await updateIssueStatus(issue.id, 'RESOLVED')
            }}>
              <Button type="submit" variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Mark as Resolved
              </Button>
            </form>
          )}
          {issue.status === 'RESOLVED' && (
            <form action={async () => {
              'use server'
              const { deleteIssue } = await import('@/app/actions/issues')
              await deleteIssue(issue.id)
              const { redirect } = await import('next/navigation')
              redirect('/issues')
            }}>
              <Button type="submit" variant="destructive" size="sm">
                Delete Issue
              </Button>
            </form>
          )}
          <Link href={`/projects/${issue.project_id || ''}`} className={buttonVariants({ variant: "outline" })}>
            View Project
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
              {issue.assignee ? `${issue.assignee.first_name} ${issue.assignee.last_name}` : 'Unassigned'}
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
              {issue.reporter ? `${issue.reporter.first_name} ${issue.reporter.last_name}` : 'System'}
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
              {new Date(issue.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Issue Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {issue.description || 'No description provided.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
