"use client"

interface UserActivityByPropertyProps {
  logs: { id: string; userName: string; action?: string; module?: string; description?: string; createdAt: string }[]
  loading?: boolean
}

export function UserActivityByProperty({ logs, loading }: UserActivityByPropertyProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-xs text-slate-100 shadow-lg">
      <h3 className="mb-2 text-sm font-semibold text-white">User Activity by Property</h3>
      {loading ? (
        <div className="flex h-32 items-center justify-center text-slate-300">Loading…</div>
      ) : logs.length === 0 ? (
        <p className="text-slate-300">No recent activity found for this property.</p>
      ) : (
        <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {logs.map((l) => (
            <li key={l.id} className="flex justify-between gap-2 rounded bg-white/5 px-2 py-1">
              <div>
                <p className="font-medium">{l.userName}</p>
                <p className="text-[10px] text-slate-200">
                  {l.module || "System"} – {l.action || ""} {l.description || ""}
                </p>
              </div>
              <span className="whitespace-nowrap text-[10px] text-slate-300">
                {new Date(l.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

