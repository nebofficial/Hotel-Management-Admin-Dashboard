'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import DebitCreditSummary from './DebitCreditSummary'
import AccountWiseBalance from './AccountWiseBalance'
import ErrorDetection from './ErrorDetection'
import ExportReport from './ExportReport'

export default function TrialBalance() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [asOf, setAsOf] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadTrialBalance = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/trial-balance?asOf=${asOf}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || 'Failed to load trial balance')
      setData(json)
    } catch (e) {
      alert(e.message || 'Failed to load trial balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiBase) loadTrialBalance()
  }, [apiBase])

  const handleApply = () => {
    loadTrialBalance()
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to view Trial Balance.
        </p>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Trial Balance…</p>
      </div>
    )
  }

  const dateStr = data?.asOf
    ? new Date(data.asOf).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trial Balance</h1>
          <p className="text-gray-600 mt-1">
            {dateStr ? `As of ${dateStr}` : 'Select a date to view trial balance.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-600">As of</span>
              <input
                type="date"
                value={asOf}
                onChange={(e) => setAsOf(e.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="mt-4 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {data && (
        <>
          {!data.isBalanced && (
            <ErrorDetection isBalanced={data.isBalanced} difference={data.difference || 0} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <DebitCreditSummary
              totalDebit={data.totalDebit || 0}
              totalCredit={data.totalCredit || 0}
              isBalanced={data.isBalanced}
            />
            <div className="lg:col-span-3">
              <ExportReport
                rows={data.rows || []}
                totalDebit={data.totalDebit || 0}
                totalCredit={data.totalCredit || 0}
                asOf={data.asOf}
              />
            </div>
          </div>

          <AccountWiseBalance
            rows={data.rows || []}
            totalDebit={data.totalDebit || 0}
            totalCredit={data.totalCredit || 0}
          />
        </>
      )}
    </div>
  )
}
