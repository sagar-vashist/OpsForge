import { getProject, updateProject } from '@/app/actions/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  async function handleUpdateProject(formData: FormData) {
    'use server'
    await updateProject(params.id, formData)
    redirect(`/projects/${params.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpdateProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Project Name</label>
                <Input id="name" name="name" defaultValue={project.name} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="projectCode" className="text-sm font-medium">Project Code</label>
                <Input id="projectCode" name="projectCode" defaultValue={project.project_code} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" name="description" defaultValue={project.description} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={project.status}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <select 
                  id="priority" 
                  name="priority" 
                  defaultValue={project.priority}
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
                <label htmlFor="progress" className="text-sm font-medium">Progress (%)</label>
                <Input 
                  id="progress" 
                  name="progress" 
                  type="number" 
                  min="0" 
                  max="100" 
                  defaultValue={project.progress || 0} 
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
              <Link href={`/projects/${project.id}`}>
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
