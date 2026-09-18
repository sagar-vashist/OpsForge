import { getTasks } from '@/app/actions/tasks'
import { KanbanBoard } from '@/components/kanban/kanban-board'

export default async function KanbanPage() {
  let tasks: any[] = []
  try {
    tasks = await getTasks()
  } catch (e) {
    console.warn("Could not fetch tasks")
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 h-full flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kanban Board</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialTasks={tasks} />
      </div>
    </div>
  )
}
