'use client'

import { useState, useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assignUserToProject } from '@/app/actions/team'

export function AssignProjectDropdown({ userId, availableProjects }: { userId: string, availableProjects: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [key, setKey] = useState(0) // hack to reset select after selection

  if (availableProjects.length === 0) return null

  return (
    <Select 
      key={key}
      value={undefined}
      onValueChange={(projectId) => {
        if (!projectId) return;
        startTransition(async () => {
          await assignUserToProject(userId, projectId)
          setKey(k => k + 1)
        })
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit h-6 text-[10px] border-dashed border-muted-foreground/50 bg-transparent hover:bg-muted ml-2">
        <SelectValue placeholder="+ Assign Project" />
      </SelectTrigger>
      <SelectContent>
        {availableProjects.map(p => (
          <SelectItem key={p.id} value={p.id}>{p.project_code} - {p.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
