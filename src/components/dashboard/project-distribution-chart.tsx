'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ProjectDistributionChartProps {
  active: number;
  completed: number;
  other: number;
}

export function ProjectDistributionChart({ active, completed, other }: ProjectDistributionChartProps) {
  // If there is no data at all, provide a placeholder state
  if (active === 0 && completed === 0 && other === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No projects exist yet.
      </div>
    )
  }

  const data = [
    { name: 'Active', value: active, color: '#3b82f6' },      // Blue
    { name: 'Completed', value: completed, color: '#10b981' }, // Emerald
  ]

  // Only show other if there are any
  if (other > 0) {
    data.push({ name: 'Other', value: other, color: '#64748b' }) // Slate
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  )
}
