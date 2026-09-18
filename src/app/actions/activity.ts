'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logActivity(title: string, message: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Insert the new log
  await supabase.from('activity_logs').insert({
    action: title,
    entity_type: 'GLOBAL', // Generic entity for now
    entity_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
    user_id: user?.id || null,
    details: { message }
  })

  // Enforce the "Only store the last 10 notifications" rule to prevent DB burden
  // First, get all logs sorted by created_at DESC
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('id')
    .order('created_at', { ascending: false })

  // If there are more than 10, delete the older ones
  if (logs && logs.length > 10) {
    const idsToDelete = logs.slice(10).map(l => l.id)
    await supabase.from('activity_logs').delete().in('id', idsToDelete)
  }

  revalidatePath('/notifications')
}

export async function getGlobalNotifications() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      user:profiles!user_id(first_name, last_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
  return data
}
