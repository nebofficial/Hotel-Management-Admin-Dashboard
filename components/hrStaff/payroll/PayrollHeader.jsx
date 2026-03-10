'use client'

import { Button } from '@/components/ui/button'
import { Calculator } from 'lucide-react'

export function PayrollHeader({ onGenerate }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Payroll Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Salary structure, payroll, payslips, reports</p>
      </div>
      <Button type="button" size="sm" className="gap-1.5 text-xs bg-orange-600 hover:bg-orange-700" onClick={onGenerate}>
        <Calculator className="w-4 h-4" />
        Generate Payroll
      </Button>
    </div>
  )
}
