import { getProjects } from '@/app/actions/projects'
import { getTeamMembers } from '@/app/actions/team'
import { createTask } from '@/app/actions/tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { redirect } from 'next/navigation'

export default async function NewTaskPage({ searchParams }: { searchParams: { error?: string } }) {
  const projects = await getProjects()
  const members = await getTeamMembers()

  async function handleCreateTask(formData: FormData) {
    'use server'
    const result = await createTask(formData)
    if (result?.error) {
      redirect(`/tasks/new?error=${encodeURIComponent(result.error)}`)
    }
    redirect('/tasks')
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Task</h2>
      </div>

      {searchParams?.error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm border border-destructive/50">
          <strong>Error creating task:</strong> {searchParams.error}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Task Title</label>
              <Input id="title" name="title" placeholder="E.g., Implement login form" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" name="description" placeholder="Task details and acceptance criteria..." rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="projectId" className="text-sm font-medium">Project</label>
                <select 
                  id="projectId" 
                  name="projectId" 
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
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <select 
                  id="priority" 
                  name="priority" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="assigneeId" className="text-sm font-medium">Assignee (Optional)</label>
              <select 
                id="assigneeId" 
                name="assigneeId" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Unassigned</option>
                {members.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Create Task</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
