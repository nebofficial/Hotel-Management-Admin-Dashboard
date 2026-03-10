"use client"

import { Activity } from "lucide-react"

interface ActivityItem {
  type: string
  propertyName: string
  message: string
  createdAt: string
}

interface RecentPropertyActivityProps {
  activities: ActivityItem[]
  loading?: boolean
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    return d.toLocaleDateString()
  } catch {
    return ""
  }
}

export function RecentPropertyActivity({ activities, loading }: RecentPropertyActivityProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-4 shadow-lg">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/95">
        <Activity className="h-4 w-4" /> Recent Activity Across Properties
      </h3>
      {loading ? (
        <div className="flex h-32 items-center justify-center text-white/70">Loading...</div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-white/70">No recent activity.</p>
      ) : (
        <ul className="space-y-2">
          {activities.slice(0, 8).map((a, i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-white/10 px-2 py-1.5 text-sm text-white/95">
              <span className="text-white/60">{formatTime(a.createdAt)}</span>
              <span className="font-medium text-emerald-300">{a.propertyName}:</span>
              <span>{a.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
