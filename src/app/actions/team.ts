'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getTeamMembers() {
  const supabase = createClient()
  
  // Fetch users, their explicit teams, and their explicit projects
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      team_members (
        teams ( id, name )
      ),
      project_members (
        projects ( id, name, project_code )
      )
    `)
    .order('first_name', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  // To avoid complex PostgREST disambiguation for tasks/issues, we'll fetch workloads separately and merge
  const { data: openTasks } = await supabase.from('tasks').select('assignee_id, status').neq('status', 'COMPLETED')
  const { data: openIssues } = await supabase.from('issues').select('assignee_id, status').neq('status', 'RESOLVED')

  const enrichedProfiles = profiles?.map(profile => {
    return {
      ...profile,
      workload: {
        tasks: openTasks?.filter(t => t.assignee_id === profile.id).length || 0,
        issues: openIssues?.filter(i => i.assignee_id === profile.id).length || 0
      }
    }
  })
  
  return enrichedProfiles || []
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = createClient()
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}

export async function getTeams() {
  const supabase = createClient()
  const { data } = await supabase.from('teams').select('*').order('name')
  return data || []
}

export async function createTeam(name: string, description?: string) {
  const supabase = createClient()
  const { error } = await supabase.from('teams').insert({ name, description })
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}

export async function assignUserToTeam(userId: string, teamId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('team_members').insert({ user_id: userId, team_id: teamId })
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}

export async function removeUserFromTeam(userId: string, teamId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('team_members').delete().match({ user_id: userId, team_id: teamId })
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}

export async function assignUserToProject(userId: string, projectId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('project_members').insert({ user_id: userId, project_id: projectId })
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}

export async function removeUserFromProject(userId: string, projectId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('project_members').delete().match({ user_id: userId, project_id: projectId })
  if (error) return { error: error.message }
  revalidatePath('/team')
  return { success: true }
}
