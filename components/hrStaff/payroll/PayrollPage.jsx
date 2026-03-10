'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { PayrollHeader } from './PayrollHeader'
import { PayrollStatsCards } from './PayrollStatsCards'
import { SalaryStructureSetup } from './SalaryStructureSetup'
import { PayrollTable } from './PayrollTable'
import { PaymentHistory } from './PaymentHistory'
import { GeneratePayrollModal } from './GeneratePayrollModal'
import {
  fetchStaffForPayroll,
  setupSalaryStructure,
  generatePayroll,
  fetchPayrollList,
  markPayrollPaid,
  fetchPaymentHistory,
  fetchPayrollReports,
} from '@/services/api/payrollApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function PayrollPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [staff, setStaff] = useState([])
  const [runs, setRuns] = useState([])
  const [history, setHistory] = useState([])
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const [staffRes, listRes, historyRes, reportsRes] = await Promise.all([
        fetchStaffForPayroll(apiBase),
        fetchPayrollList(apiBase, { month, year }),
        fetchPaymentHistory(apiBase),
        fetchPayrollReports(apiBase, { month, year }),
      ])
      setStaff(staffRes.staff || [])
      setRuns(listRes.runs || [])
      setHistory(historyRes.history || [])
      setReports(reportsRes)
    } catch (err) {
      console.error('Payroll load error', err)
      setStaff([])
      setRuns([])
      setHistory([])
      setReports({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(); }, [apiBase, month, year])

  const handleSetupSalary = async (payload) => {
    if (!apiBase) return
    await setupSalaryStructure(apiBase, payload)
    await load()
  }

  const handleGenerate = async (payload) => {
    if (!apiBase) return
    await generatePayroll(apiBase, payload)
    setMonth(payload.month)
    setYear(payload.year)
    await load()
  }

  const handleMarkPaid = async (entryId) => {
    if (!apiBase) return
    await markPayrollPaid(apiBase, entryId)
    await load()
  }

  const currentRun = runs[0]
  const entries = currentRun?.entries || []

  if (!effectiveHotelId) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-600 text-sm">Select a hotel</p></div>
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-amber-50/25">
      <PayrollHeader onGenerate={() => setGenerateOpen(true)} />
      <PayrollStatsCards reports={reports} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SalaryStructureSetup
            staff={staff}
            selectedStaffId={selectedStaffId}
            onSelectStaff={setSelectedStaffId}
            onSave={handleSetupSalary}
          />
          <div>
            <div className="flex gap-2 mb-2">
              <select className="h-8 rounded border text-xs px-2" value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                  <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select className="h-8 rounded border text-xs px-2" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <PayrollTable entries={entries} onMarkPaid={handleMarkPaid} />
          </div>
        </div>
        <div className="space-y-4">
          <PaymentHistory history={history} />
        </div>
      </div>

      <GeneratePayrollModal open={generateOpen} onOpenChange={setGenerateOpen} onSubmit={handleGenerate} />
    </div>
  )
}
