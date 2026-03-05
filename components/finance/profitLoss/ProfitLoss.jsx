'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import IncomeSummary from './IncomeSummary'
import ExpenseSummary from './ExpenseSummary'
import NetProfitCard from './NetProfitCard'
import DepartmentWisePL from './DepartmentWisePL'
import MonthlyComparisonChart from './MonthlyComparisonChart'

export default function ProfitLoss() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    return d.toISOString().slice(0, 10)
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      const res = await fetch(`${apiBase}/profit-loss?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || 'Failed to load profit & loss data')
      setData(json)
    } catch (e) {
      alert(e.message || 'Failed to load profit & loss data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiBase) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const handleApplyDates = () => {
    load()
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to view Profit & Loss.
        </p>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Profit & Loss data…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-sky-50/20 to-emerald-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profit & Loss</h1>
          <p className="text-gray-600 mt-1">
            View income, expenses, and net profit for the selected period.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex flex-col">
            <span className="text-gray-600">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-1 text-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-1 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyDates}
            className="mt-4 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
          >
            Apply
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <IncomeSummary income={data.income} />
            <ExpenseSummary expenses={data.expenses} />
            <NetProfitCard
              incomeTotal={data.income?.totalIncome}
              expenseTotal={data.expenses?.totalExpenses}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DepartmentWisePL data={data.departmentWise} />
            <MonthlyComparisonChart data={data.byMonth} />
          </div>
        </>
      )}
    </div>
  )
}

