'use client'

import { useState, useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assignUserToTeam } from '@/app/actions/team'

export function AssignTeamDropdown({ userId, availableTeams }: { userId: string, availableTeams: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [key, setKey] = useState(0) // hack to reset select after selection

  if (availableTeams.length === 0) return null

  return (
    <Select 
      key={key} 
      value={undefined}
      onValueChange={(teamId) => {
        if (!teamId) return;
        startTransition(async () => {
          await assignUserToTeam(userId, teamId)
          setKey(k => k + 1)
        })
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-fit h-6 text-[10px] border-dashed border-muted-foreground/50 bg-transparent hover:bg-muted ml-2">
        <SelectValue placeholder="+ Assign" />
      </SelectTrigger>
      <SelectContent>
        {availableTeams.map(t => (
          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
