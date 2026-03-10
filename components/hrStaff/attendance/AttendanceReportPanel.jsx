'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { generateAttendanceReport } from '@/services/api/attendanceApi'

export function AttendanceReportPanel({ apiBase }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const res = await generateAttendanceReport(apiBase, { from, to })
      setSummary(res.report?.summary || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-stone-50 border-amber-100 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-amber-900">Attendance Report</CardTitle>
      </CardHeader>
      <CardContent className="pt-1 space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[11px]">From</Label>
            <Input className="h-8 text-xs" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">To</Label>
            <Input className="h-8 text-xs" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <Button type="button" size="sm" className="h-8 text-xs mt-1" disabled={loading} onClick={handleGenerate}>
          {loading ? 'Generating…' : 'Generate Report'}
        </Button>
        {error && <div className="text-[11px] text-rose-700 mt-1">{error}</div>}
        {summary && (
          <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-800">
            <div>Total Days: {summary.totalDays}</div>
            <div>Present: {summary.present}</div>
            <div>Absent: {summary.absent}</div>
            <div>Late: {summary.late}</div>
            <div>Early Exits: {summary.earlyExit}</div>
            <div>Attendance Rate: {summary.attendanceRate?.toFixed?.(1)}%</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

