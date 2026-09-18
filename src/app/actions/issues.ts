'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getIssues(projectId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('issues')
    .select(`
      *,
      project:projects!project_id(name, project_code),
      assignee:profiles!assignee_id(first_name, last_name, avatar_url),
      reporter:profiles!reporter_id(first_name, last_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (projectId) {
    query = query.eq('project_id', projectId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching issues:', error)
    return []
  }
  return data
}

export async function getIssue(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      project:projects!project_id(name, project_code),
      assignee:profiles!assignee_id(first_name, last_name, avatar_url),
      reporter:profiles!reporter_id(first_name, last_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching issue:', error)
    return null
  }
  return data
}

export async function deleteIssue(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('issues').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  await logActivity('Issue Deleted', `An issue was permanently deleted.`)

  revalidatePath('/issues')
  return { success: true }
}

export async function updateIssueStatus(id: string, status: string) {
  const supabase = createClient()
  
  const { data: issue } = await supabase.from('issues').select('title').eq('id', id).single()

  const { error } = await supabase
    .from('issues')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  if (issue) {
    await logActivity('Issue Status Updated', `Issue "${issue.title}" was marked as ${status}.`)
  }

  revalidatePath('/issues')
  revalidatePath(`/issues/${id}`)
  return { success: true }
}

export async function createIssue(formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const projectId = formData.get('projectId') as string
  const assigneeId = formData.get('assigneeId') as string

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('issues').insert({
    title,
    description,
    priority,
    project_id: projectId,
    assignee_id: assigneeId || null,
    reporter_id: user?.id,
    status: 'OPEN'
  })

  if (error) {
    return { error: error.message }
  }

  await logActivity('New Issue Reported', `Issue "${title}" was reported.`)

  revalidatePath('/issues')
  return { success: true }
}
