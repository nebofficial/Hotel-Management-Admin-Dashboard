'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SalaryStructureSetup({ staff = [], selectedStaffId, onSelectStaff, onSave }) {
  const [basicSalary, setBasicSalary] = useState('')
  const [overtimeRate, setOvertimeRate] = useState('0')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const selected = staff.find((s) => s.id === selectedStaffId)

  const handleSave = async () => {
    if (!selected || !basicSalary) return
    setSaveError(null)
    setSaving(true)
    try {
      await onSave?.({
        staffId: selected.id,
        staffName: selected.name,
        basicSalary: parseFloat(basicSalary),
        overtimeRatePerHour: parseFloat(overtimeRate) || 0,
      })
    } catch (err) {
      setSaveError(err?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const s = selected?.salaryStructure
    if (s) {
      setBasicSalary(String(s.basicSalary ?? ''))
      setOvertimeRate(String(s.overtimeRatePerHour ?? ''))
    } else {
      setBasicSalary('')
      setOvertimeRate('')
    }
  }, [selected])

  const staffWithSalary = staff.filter((s) => s.salaryStructure)

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Salary Structure Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <Label className="text-[11px]">Employee</Label>
          <select className="h-8 w-full rounded-md border text-xs mt-1" value={selectedStaffId || ''} onChange={(e) => onSelectStaff?.(e.target.value)}>
            <option value="">Select employee</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-[11px]">Basic Salary</Label>
          <Input
            type="number"
            min={0}
            className="h-8 text-xs"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            placeholder={selected ? "Enter amount" : "Select employee first"}
            disabled={!selected}
          />
        </div>
        <div>
          <Label className="text-[11px]">Overtime Rate (per hour)</Label>
          <Input
            type="number"
            min={0}
            className="h-8 text-xs"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
            placeholder={selected ? "Enter rate (0 if none)" : "Select employee first"}
            disabled={!selected}
          />
        </div>
        {saveError && <p className="text-[11px] text-red-600">{saveError}</p>}
        <Button type="button" size="sm" className="h-8 text-xs" disabled={!selected || !basicSalary || parseFloat(basicSalary) <= 0 || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        {staffWithSalary.length > 0 && (
          <div className="pt-3 border-t border-sky-200">
            <p className="text-[11px] font-medium text-slate-600 mb-1">Saved salary structures – click to edit</p>
            <div className="flex flex-wrap gap-1">
              {staffWithSalary.map((s) => (
                <span
                  key={s.id}
                  className={`inline-block px-2 py-0.5 rounded text-[10px] cursor-pointer ${selectedStaffId === s.id ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-600'}`}
                  onClick={() => onSelectStaff?.(s.id)}
                >
                  {s.name} ({Number(s.salaryStructure?.basicSalary || 0).toLocaleString()})
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
