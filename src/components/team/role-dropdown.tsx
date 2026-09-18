'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateUserRole } from '@/app/actions/team'
import { useState, useTransition } from 'react'

export function RoleDropdown({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition()
  const [key, setKey] = useState(0)

  return (
    <Select 
      key={key} 
      defaultValue={currentRole}
      onValueChange={(role: string | null) => {
        if (!role) return;
        startTransition(async () => {
          await updateUserRole(userId, role as "ADMIN" | "MANAGER" | "MEMBER")
          setKey(k => k + 1)
        })
      }}
      disabled={isPending || currentRole === 'ADMIN'}
    >
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
        <SelectItem value="DEVELOPER">Developer</SelectItem>
        <SelectItem value="EMPLOYEE">Employee</SelectItem>
      </SelectContent>
    </Select>
  )
}
