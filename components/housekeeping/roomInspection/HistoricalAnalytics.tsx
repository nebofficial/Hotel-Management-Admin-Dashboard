import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export interface HistoricalInspection {
  id: string
  roomNumber: string
  inspector: string
  scheduledDate: string
  status: string
  issuesCount: number
}

interface HistoricalAnalyticsProps {
  inspections: HistoricalInspection[]
}

export function HistoricalAnalytics({ inspections }: HistoricalAnalyticsProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [start, end] = getDefaultRange(today)

  const filtered = inspections.filter((i) => {
    if (!i.scheduledDate) return false
    if (start && i.scheduledDate < start) return false
    if (end && i.scheduledDate > end) return false
    return true
  })

  const total = filtered.length
  const issues = filtered.filter((i) => i.issuesCount > 0).length
  const completed = filtered.filter((i) => i.status === "Completed").length

  const issueRate = total > 0 ? Math.round((issues / total) * 100) : 0
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
      <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold text-slate-900">
          Historical analytics (last 7 days)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Inspections" value={total} />
          <Metric label="Completion rate" value={`${completionRate}%`} />
          <Metric label="Issue rate" value={`${issueRate}%`} />
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-700">
            Recent inspections
          </p>
          <div className="max-h-40 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/60">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-slate-500">
                No inspections recorded in the last few days.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filtered
                  .slice()
                  .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
                  .slice(0, 20)
                  .map((i) => (
                    <li key={i.id} className="px-2 py-1.5 flex justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          Room {i.roomNumber} • {i.inspector}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {i.scheduledDate} • {i.status}
                        </span>
                      </div>
                      {i.issuesCount > 0 && (
                        <span className="shrink-0 rounded-full bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5">
                          {i.issuesCount} issue(s)
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricProps {
  label: string
  value: string | number
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function getDefaultRange(today: string): [string, string] {
  const d = new Date(today)
  const end = today
  const startDate = new Date(d.getTime() - 6 * 24 * 60 * 60 * 1000)
  const start = startDate.toISOString().slice(0, 10)
  return [start, end]
}

