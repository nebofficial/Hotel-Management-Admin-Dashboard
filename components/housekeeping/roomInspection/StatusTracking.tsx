import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, ClipboardCheck } from "lucide-react"

export type InspectionStatus = "Pending" | "Completed" | "Issues Reported"

export interface StatusInspection {
  id: string
  roomNumber: string
  inspector: string
  scheduledDate: string
  shift: string
  status: InspectionStatus
  issuesCount: number
}

interface StatusTrackingProps {
  inspections: StatusInspection[]
}

export function StatusTracking({ inspections }: StatusTrackingProps) {
  const total = inspections.length
  const completed = inspections.filter((i) => i.status === "Completed").length
  const issues = inspections.filter((i) => i.status === "Issues Reported").length
  const pending = inspections.filter((i) => i.status === "Pending").length

  const statusBadge = (status: InspectionStatus) => {
    if (status === "Completed") return "bg-emerald-50 text-emerald-700"
    if (status === "Issues Reported") return "bg-rose-50 text-rose-700"
    return "bg-amber-50 text-amber-700"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="space-y-3 lg:col-span-1">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total inspections</p>
              <p className="text-xl font-bold text-slate-900">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Completed</p>
              <p className="text-xl font-bold text-emerald-600">{completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Pending / Issues</p>
              <p className="text-xl font-bold text-amber-600">
                {pending + issues}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Status tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs md:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Room
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Inspector
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Date / shift
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">
                    Issues
                  </th>
                </tr>
              </thead>
              <tbody>
                {inspections.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-xs text-slate-500"
                    >
                      No inspections available.
                    </td>
                  </tr>
                ) : (
                  inspections.slice(0, 25).map((i) => (
                    <tr
                      key={i.id}
                      className="border-b border-slate-100 hover:bg-slate-50/60"
                    >
                      <td className="px-3 py-2 font-medium text-slate-900">
                        Room {i.roomNumber}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{i.inspector}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {i.scheduledDate} • {i.shift}
                      </td>
                      <td className="px-3 py-2">
                        <Badge className={statusBadge(i.status)}>{i.status}</Badge>
                      </td>
                      <td className="px-3 py-2 text-slate-700 text-xs">
                        {i.issuesCount > 0 ? `${i.issuesCount} issue(s)` : "No issues"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

