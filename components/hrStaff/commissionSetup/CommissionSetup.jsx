'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { CommissionHeader } from './CommissionHeader'
import { CommissionStatsCards } from './CommissionStatsCards'
import { CommissionRuleForm } from './CommissionRuleForm'
import { CommissionTable } from './CommissionTable'
import {
  fetchCommissionRules,
  fetchCommissionList,
  fetchCommissionReports,
  updateCommissionPayout,
} from '@/services/api/commissionApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function CommissionSetup() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [rules, setRules] = useState([])
  const [transactions, setTransactions] = useState([])
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(false)

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const formSectionRef = useRef(null)

  const handleAddRule = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const [rulesRes, listRes, reportsRes] = await Promise.all([
        fetchCommissionRules(apiBase),
        fetchCommissionList(apiBase, { month, year }),
        fetchCommissionReports(apiBase, { month, year }),
      ])
      setRules(rulesRes.rules || [])
      setTransactions(listRes.list || [])
      setReports(reportsRes)
    } catch (err) {
      console.error('Commission load error', err)
      setRules([])
      setTransactions([])
      setReports({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, month, year])

  const handleRuleCreated = async () => {
    await load()
  }

  const handlePayout = async (id) => {
    if (!apiBase) return
    await updateCommissionPayout(apiBase, id, { status: 'paid' })
    await load()
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to configure commissions.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-slate-900/5">
      <CommissionHeader onAddRule={handleAddRule} />
      <CommissionStatsCards reports={reports} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div ref={formSectionRef}>
            <CommissionRuleForm apiBase={apiBase} onCreated={handleRuleCreated} />
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <select
                className="h-8 rounded border text-xs px-2"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded border text-xs px-2"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <CommissionTable transactions={transactions} onPayout={handlePayout} loading={loading} />
          </div>
        </div>
        <div className="space-y-4">
          {/* Placeholder for future StaffCommissionAssignment, Reports panels, etc. */}
          <div className="border border-slate-200 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-3 text-xs text-slate-700">
            <p className="font-semibold mb-1">Next steps</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Integrate commission calculation with Spa / Restaurant / Room bills.</li>
              <li>Add staff assignment panel and advanced filters.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

