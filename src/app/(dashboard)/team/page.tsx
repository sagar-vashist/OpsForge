import { getTeamMembers, getTeams, removeUserFromTeam } from '@/app/actions/team'
import { getProjects } from '@/app/actions/projects'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { UserCircle, Briefcase, Bug, CheckSquare, X } from 'lucide-react'
import { RoleDropdown } from '@/components/team/role-dropdown'
import { AssignTeamDropdown } from '@/components/team/assign-team-dropdown'
import { AssignProjectDropdown } from '@/components/team/assign-project-dropdown'
import { InviteUserDialog } from '@/components/team/invite-user-dialog'
import { CreateTeamDialog } from '@/components/team/create-team-dialog'
import { Button } from '@/components/ui/button'

export default async function TeamPage() {
  const members = await getTeamMembers()
  const availableTeams = await getTeams()
  const projects = await getProjects()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
        <div className="flex items-center gap-2">
          <CreateTeamDialog />
          <InviteUserDialog />
        </div>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-[#0f172a]">
            <TableRow className="hover:bg-[#0f172a]">
              <TableHead className="text-white font-bold w-[250px]">Member</TableHead>
              <TableHead className="text-white font-bold">Role</TableHead>
              <TableHead className="text-white font-bold">Departments</TableHead>
              <TableHead className="text-white font-bold">Workload (Open)</TableHead>
              <TableHead className="text-white font-bold">Assigned Projects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No team members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  {/* Member Name & Email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-medium truncate">
                          {member.first_name || 'Unknown'} {member.last_name || ''}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role Dropdown */}
                  <TableCell>
                    <RoleDropdown userId={member.id} currentRole={member.role} />
                  </TableCell>

                  {/* Departments */}
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {member.team_members?.map((tm: any) => (
                        <Badge key={tm.teams.id} variant="secondary" className="flex items-center gap-1 font-normal text-xs">
                          {tm.teams.name}
                          <form action={async () => {
                            'use server'
                            await removeUserFromTeam(member.id, tm.teams.id)
                          }}>
                            <button type="submit" className="hover:text-destructive text-muted-foreground transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </form>
                        </Badge>
                      ))}
                      <AssignTeamDropdown 
                        userId={member.id} 
                        availableTeams={availableTeams.filter(t => !member.team_members?.find((tm: any) => tm.teams.id === t.id))} 
                      />
                    </div>
                  </TableCell>

                  {/* Workload */}
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="flex gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
                        <CheckSquare className="h-3 w-3" />
                        {member.workload?.tasks} Tasks
                      </Badge>
                      <Badge variant="outline" className="flex gap-1 bg-red-50 text-red-700 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                        <Bug className="h-3 w-3" />
                        {member.workload?.issues} Issues
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Assigned Projects */}
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      {member.project_members?.map((pm: any) => (
                        <Badge key={pm.projects.id} variant="outline" className="flex items-center gap-1 text-[10px] uppercase">
                          {pm.projects.project_code}
                          <form action={async () => {
                            'use server'
                            const { removeUserFromProject } = await import('@/app/actions/team')
                            await removeUserFromProject(member.id, pm.projects.id)
                          }}>
                            <button type="submit" className="hover:text-destructive text-muted-foreground transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </form>
                        </Badge>
                      ))}
                      <AssignProjectDropdown 
                        userId={member.id} 
                        availableProjects={projects.filter((p: any) => !member.project_members?.find((pm: any) => pm.projects.id === p.id))} 
                      />
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
