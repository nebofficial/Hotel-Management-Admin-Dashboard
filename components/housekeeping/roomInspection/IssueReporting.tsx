import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface IssueInspection {
  id: string
  roomNumber: string
  inspector: string
  scheduledDate: string
  issuesSummary?: string | null
  issuesCount: number
  status: string
}

interface IssueReportingProps {
  inspections: IssueInspection[]
  activeInspectionId: string | null
  onSelectInspection: (id: string) => void
  onUpdateIssues: (
    id: string,
    updates: { issuesSummary: string; issuesCount: number; status?: string },
  ) => Promise<void> | void
  saving: boolean
}

export function IssueReporting({
  inspections,
  activeInspectionId,
  onSelectInspection,
  onUpdateIssues,
  saving,
}: IssueReportingProps) {
  const active = inspections.find((i) => i.id === activeInspectionId) || inspections[0]
  const currentId = active?.id || null

  const [summary, setSummary] = useState(active?.issuesSummary || "")
  const [count, setCount] = useState<number>(active?.issuesCount || 0)
  const [markResolved, setMarkResolved] = useState(false)

  useEffect(() => {
    setSummary(active?.issuesSummary || "")
    setCount(active?.issuesCount || 0)
    setMarkResolved(active?.status === "Completed")
  }, [active?.id])

  const handleSubmit = async () => {
    if (!currentId) return
    const numericCount = Number.isNaN(Number(count)) ? 0 : Number(count)
    const updates: { issuesSummary: string; issuesCount: number; status?: string } = {
      issuesSummary: summary.trim(),
      issuesCount: numericCount,
    }
    if (markResolved) {
      updates.status = "Completed"
    } else if (numericCount > 0 && !summary.trim()) {
      updates.status = "Issues Reported"
    }
    await onUpdateIssues(currentId, updates)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Issue reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3 text-xs">
          {!active ? (
            <p className="text-slate-500">
              Select an inspection from the list to record issues or mark it as resolved.
            </p>
          ) : (
            <>
              <p className="text-[11px] text-slate-500">
                Room {active.roomNumber} • {active.inspector} • {active.scheduledDate}
              </p>
              <div className="space-y-1">
                <Label
                  htmlFor="inspection-issues-summary"
                  className="text-[11px] text-slate-700"
                >
                  Issues summary
                </Label>
                <Textarea
                  id="inspection-issues-summary"
                  rows={3}
                  className="text-xs"
                  placeholder="Describe maintenance, cleanliness, or amenity issues found during inspection"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <div className="space-y-1">
                  <Label
                    htmlFor="inspection-issues-count"
                    className="text-[11px] text-slate-700"
                  >
                    Number of issues
                  </Label>
                  <Input
                    id="inspection-issues-count"
                    type="number"
                    min={0}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value || 0))}
                    className="h-8 text-xs"
                  />
                </div>
                <label className="inline-flex items-center gap-2 text-[11px] text-slate-700">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    checked={markResolved}
                    onChange={(e) => setMarkResolved(e.target.checked)}
                  />
                  Mark inspection as fully resolved (status: Completed)
                </label>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  disabled={saving || !currentId}
                  onClick={handleSubmit}
                  className="text-xs"
                >
                  {saving ? "Saving…" : "Save issues"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Inspections with issues
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs space-y-1.5">
          {inspections.filter((i) => i.issuesCount > 0).length === 0 ? (
            <p className="text-slate-500">No inspections have issues reported.</p>
          ) : (
            inspections
              .filter((i) => i.issuesCount > 0)
              .slice(0, 15)
              .map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => onSelectInspection(i.id)}
                  className={`w-full text-left rounded-md border px-2 py-1.5 text-[11px] ${
                    i.id === currentId
                      ? "border-rose-300 bg-rose-50 text-rose-800"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">
                      Room {i.roomNumber} • {i.issuesCount} issue(s)
                    </span>
                    <span className="text-slate-500">{i.scheduledDate}</span>
                  </div>
                  {i.issuesSummary && (
                    <p className="mt-0.5 text-[10px] text-slate-600 line-clamp-2">
                      {i.issuesSummary}
                    </p>
                  )}
                </button>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

