'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { updateTaskStatus } from '@/app/actions/tasks'

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'COMPLETED', title: 'Completed' },
]

export function KanbanBoard({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
    // For Firefox compatibility
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault()
    if (!draggedTaskId) return

    const taskToMove = tasks.find(t => t.id === draggedTaskId)
    if (taskToMove && taskToMove.status !== status) {
      // Optimistic update
      const previousTasks = [...tasks]
      setTasks(tasks.map(t => t.id === draggedTaskId ? { ...t, status } : t))
      
      try {
        const res = await updateTaskStatus(draggedTaskId, status)
        if (res.error) {
          throw new Error(res.error)
        }
      } catch (err) {
        // Revert on error
        setTasks(previousTasks)
        console.error(err)
      }
    }
    setDraggedTaskId(null)
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((column) => (
        <div 
          key={column.id} 
          className="flex flex-col w-80 shrink-0"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm text-muted-foreground">{column.title}</h3>
            <Badge variant="secondary" className="rounded-sm">
              {tasks?.filter((t) => t.status === column.id).length || 0}
            </Badge>
          </div>
          
          <div className="flex-1 bg-muted/30 rounded-lg p-2 flex flex-col gap-2 overflow-y-auto min-h-[150px]">
            {tasks?.filter(t => t.status === column.id).map(task => (
              <Card 
                key={task.id} 
                className="cursor-move hover:border-primary/50 transition-colors"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <CardHeader className="p-3 pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={task.priority ? task.priority.toLowerCase() as any : 'outline'} className="text-[10px]">
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{task.project?.project_code}</span>
                  </div>
                  <CardTitle className="text-sm font-medium mt-2">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-xs text-muted-foreground flex justify-between items-center">
                  <span>{task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned'}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
