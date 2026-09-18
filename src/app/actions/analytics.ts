'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAnalyticsData() {
  const supabase = createClient()
  
  // Try to fetch real counts
  try {
    const now = new Date().toISOString()
    
    const [
      { count: totalProjects },
      { count: activeProjects },
      { count: completedProjects },
      { count: totalTasks },
      { count: completedTasks },
      { count: overdueTasks },
      { count: openIssues }
    ] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
      supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['COMPLETED', 'ARCHIVED']),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'COMPLETED'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).neq('status', 'COMPLETED').lt('due_date', now),
      supabase.from('issues').select('*', { count: 'exact', head: true }).eq('status', 'OPEN')
    ])

    return {
      totalProjects: totalProjects || 0,
      activeProjects: activeProjects || 0,
      completedProjects: completedProjects || 0,
      totalTasks: totalTasks || 0,
      completedTasks: completedTasks || 0,
      overdueTasks: overdueTasks || 0,
      openIssues: openIssues || 0,
      completionRate: totalTasks ? Math.round((completedTasks! / totalTasks!) * 100) : 0
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      openIssues: 0,
      completionRate: 0
    }
  }
}

export async function getMonthlyVelocity() {
  const supabase = createClient()
  const { data: tasks } = await supabase.from('tasks').select('status, created_at')
  const { data: issues } = await supabase.from('issues').select('created_at')

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentYear = new Date().getFullYear()
  const velocityData = monthNames.map(name => ({ name, tasksCompleted: 0, issuesReported: 0 }))

  tasks?.forEach((t: any) => {
    if (t.status === 'COMPLETED' && t.created_at) {
      const d = new Date(t.created_at)
      if (d.getFullYear() === currentYear) {
        velocityData[d.getMonth()].tasksCompleted += 1
      }
    }
  })

  issues?.forEach((i: any) => {
    if (i.created_at) {
      const d = new Date(i.created_at)
      if (d.getFullYear() === currentYear) {
        velocityData[d.getMonth()].issuesReported += 1
      }
    }
  })

  // To make the chart look nice when there's very little data, we can fill missing months with 0s. 
  // It's already done above. We don't want an empty array if there's no data.
  // Actually, wait! The Overview component checks `if (!data || data.length === 0)`
  // But `velocityData` has length 12 regardless!
  // BUT in overview, maybe we want it to render the empty chart rather than "No data available"?
  // Yes, let the chart render the empty axes.

  return velocityData
}
