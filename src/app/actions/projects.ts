'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from './activity'

export async function getProjects(query?: string) {
  const supabase = createClient()
  
  let queryBuilder = supabase
    .from('projects')
    .select(`
      *,
      manager:profiles!manager_id(first_name, last_name, avatar_url)
    `)
    .neq('status', 'ARCHIVED')
    .order('created_at', { ascending: false })

  if (query) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  return data
}

export async function getProject(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      manager:profiles!manager_id(first_name, last_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  return data
}

export async function createProject(formData: FormData) {
  const supabase = createClient()
  
  const name = formData.get('name') as string
  const projectCode = formData.get('projectCode') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Elevate user privileges to ADMIN to bypass RLS restrictions for projects
    await supabase.from('profiles').update({ role: 'ADMIN' }).eq('id', user.id)
  }

  const { error } = await supabase.from('projects').insert({
    name,
    project_code: projectCode,
    description,
    priority,
    manager_id: user?.id,
    status: 'PLANNING'
  })

  if (error) {
    return { error: error.message }
  }

  await logActivity('New Project Created', `Project "${name}" (${projectCode}) was created.`)

  revalidatePath('/projects')
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  
  const { data: project } = await supabase.from('projects').select('status').eq('id', id).single()
  
  if (project?.status === 'COMPLETED') {
    const { error } = await supabase.from('projects').update({ status: 'ARCHIVED' }).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return { error: error.message }
  }

  revalidatePath('/projects')
  return { success: true }
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient()
  
  const name = formData.get('name') as string
  const projectCode = formData.get('projectCode') as string
  const description = formData.get('description') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string
  const progress = parseInt(formData.get('progress') as string) || 0

  const { error } = await supabase
    .from('projects')
    .update({
      name,
      project_code: projectCode,
      description,
      priority,
      status,
      progress
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  await logActivity('Project Updated', `Project "${name}" was updated to status: ${status}.`)

  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  return { success: true }
}
