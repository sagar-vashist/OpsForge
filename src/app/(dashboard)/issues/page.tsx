import { createClient } from '@/lib/supabase/server'
import { getIssues, deleteIssue } from '@/app/actions/issues'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus, X, Check } from 'lucide-react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default async function IssuesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const canManage = (issue: any) => {
    if (!user) return false;
    return issue.reporter_id === user.id || issue.assignee_id === user.id;
  }

  let issues: any[] = []
  try {
    issues = await getIssues()
  } catch (e) {
    console.warn("Could not fetch issues")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Issues Tracker</h2>
        <div className="flex items-center space-x-2">
          <Link href="/issues/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> Report Issue
          </Link>
        </div>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-[#0f172a]">
            <TableRow className="hover:bg-[#0f172a]">
              <TableHead className="text-white font-bold">Issue</TableHead>
              <TableHead className="text-white font-bold">Project</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Priority</TableHead>
              <TableHead className="text-white font-bold">Reporter</TableHead>
              <TableHead className="text-white font-bold">Assignee</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No issues found.
                </TableCell>
              </TableRow>
            ) : (
              issues?.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <Link href={`/issues/${issue.id}`} className="hover:underline">
                      {issue.title}
                    </Link>
                  </TableCell>
                  <TableCell>{issue.project?.name}</TableCell>
                  <TableCell>
                    <Badge variant={issue.status === 'RESOLVED' ? 'completed' : issue.status === 'OPEN' ? 'default' : 'secondary'}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.priority ? issue.priority.toLowerCase() as any : 'outline'}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {issue.reporter ? `${issue.reporter.first_name} ${issue.reporter.last_name}` : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {issue.assignee ? `${issue.assignee.first_name} ${issue.assignee.last_name}` : 'Unassigned'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/issues/${issue.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                      {issue.status !== 'RESOLVED' && canManage(issue) && (
                        <form action={async () => {
                          'use server'
                          const { updateIssueStatus } = await import('@/app/actions/issues')
                          await updateIssueStatus(issue.id, 'RESOLVED')
                        }}>
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-600/10" title="Mark as Resolved">
                            <Check className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      {issue.status === 'RESOLVED' && canManage(issue) && (
                        <form action={async () => {
                          'use server'
                          await deleteIssue(issue.id)
                        }}>
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Delete resolved issue">
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
