'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getTasks(projectId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('tasks')
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
    console.error('Error fetching tasks:', error)
    return []
  }
  return data
}

export async function getTask(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      project:projects!project_id(name, project_code),
      assignee:profiles!assignee_id(first_name, last_name, avatar_url),
      reporter:profiles!reporter_id(first_name, last_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching task:', error)
    return null
  }
  return data
}

export async function updateTaskStatus(id: string, status: string) {
  const supabase = createClient()
  
  // fetch title for the log
  const { data: task } = await supabase.from('tasks').select('title').eq('id', id).single()

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  if (task) {
    await logActivity('Task Status Changed', `Task "${task.title}" was moved to ${status}.`)
  }

  revalidatePath('/kanban')
  revalidatePath('/tasks')
  return { success: true }
}

export async function createTask(formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const projectId = formData.get('projectId') as string
  const assigneeId = formData.get('assigneeId') as string

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    priority,
    project_id: projectId,
    assignee_id: assigneeId || null,
    reporter_id: user?.id,
    status: 'TODO'
  })

  if (error) {
    return { error: error.message }
  }

  await logActivity('New Task Created', `Task "${title}" was created.`)

  revalidatePath('/tasks')
  revalidatePath('/kanban')
  return { success: true }
}

export async function deleteTask(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  
  if (error) {
    return { error: error.message }
  }

  await logActivity('Task Deleted', `A task was permanently deleted.`)

  revalidatePath('/tasks')
  revalidatePath('/kanban')
  return { success: true }
}

export async function updateTask(id: string, formData: FormData) {
  const supabase = createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const projectId = formData.get('projectId') as string
  const assigneeId = formData.get('assigneeId') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('tasks').update({
    title,
    description,
    priority,
    project_id: projectId,
    assignee_id: assigneeId || null,
    status
  }).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  await logActivity('Task Updated', `Task "${title}" was updated.`)

  revalidatePath('/tasks')
  revalidatePath('/kanban')
  revalidatePath(`/tasks/${id}`)
  return { success: true }
}
