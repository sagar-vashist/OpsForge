import { getProjects } from '@/app/actions/projects'
import { getTeamMembers } from '@/app/actions/team'
import { getTask, updateTask } from '@/app/actions/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditTaskPage({ params, searchParams }: { params: { id: string }, searchParams: { error?: string } }) {
  const task = await getTask(params.id)
  if (!task) notFound()

  const projects = await getProjects()
  const members = await getTeamMembers()

  async function handleUpdateTask(formData: FormData) {
    'use server'
    const result = await updateTask(params.id, formData)
    if (result?.error) {
      redirect(`/tasks/${params.id}/edit?error=${encodeURIComponent(result.error)}`)
    }
    redirect(`/tasks/${params.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Task</h2>
      </div>

      {searchParams?.error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm border border-destructive/50">
          <strong>Error updating task:</strong> {searchParams.error}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateTask} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Task Title</label>
              <Input id="title" name="title" defaultValue={task.title} required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" name="description" defaultValue={task.description || ''} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="projectId" className="text-sm font-medium">Project</label>
                <select 
                  id="projectId" 
                  name="projectId" 
                  defaultValue={task.project_id}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={task.status}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="IN_REVIEW">IN_REVIEW</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <select 
                  id="priority" 
                  name="priority" 
                  defaultValue={task.priority}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assigneeId" className="text-sm font-medium">Assignee (Optional)</label>
                <select 
                  id="assigneeId" 
                  name="assigneeId" 
                  defaultValue={task.assignee_id || ""}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Unassigned</option>
                  {members.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Link href={`/tasks/${task.id}`} className={buttonVariants({ variant: "outline" })}>
                Cancel
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
