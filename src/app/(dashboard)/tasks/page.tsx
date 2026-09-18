import { getTasks, deleteTask } from '@/app/actions/tasks'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
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

export default async function TasksPage() {
  let tasks: any[] = []
  try {
    tasks = await getTasks()
  } catch (e) {
    console.warn("Could not fetch tasks")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <div className="flex items-center space-x-2">
          <Link href="/tasks/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </div>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-[#0f172a]">
            <TableRow className="hover:bg-[#0f172a]">
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Project</TableHead>
              <TableHead className="text-white font-bold">Status</TableHead>
              <TableHead className="text-white font-bold">Priority</TableHead>
              <TableHead className="text-white font-bold">Assignee</TableHead>
              <TableHead className="text-white font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No tasks found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <Link href={`/tasks/${task.id}`} className="hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>{task.project?.name}</TableCell>
                  <TableCell>
                    <Badge variant={task.status === 'COMPLETED' ? 'completed' : task.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.priority ? task.priority.toLowerCase() as any : 'outline'}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/tasks/${task.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        View
                      </Link>
                      {task.status === 'COMPLETED' && (
                        <form action={async () => {
                          'use server'
                          await deleteTask(task.id)
                        }}>
                          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Delete completed task">
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
