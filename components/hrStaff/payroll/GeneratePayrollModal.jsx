'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function GeneratePayrollModal({ open, onOpenChange, onSubmit }) {
  const d = new Date()
  const [month, setMonth] = useState(d.getMonth() + 1)
  const [year, setYear] = useState(d.getFullYear())
  const [saving, setSaving] = useState(false)

  const handleGenerate = async () => {
    setSaving(true)
    try {
      await onSubmit?.({ month, year })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-gradient-to-br from-orange-50 to-amber-50">
        <DialogHeader><DialogTitle className="text-sm font-semibold">Generate Payroll</DialogTitle></DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px]">Month</Label>
              <select className="h-8 w-full rounded-md border mt-1" value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                  <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[11px]">Year</Label>
              <input type="number" className="h-8 w-full rounded-md border mt-1 px-2" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} />
            </div>
          </div>
          <Button type="button" size="sm" disabled={saving} onClick={handleGenerate}>{saving ? 'Generating...' : 'Generate'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
