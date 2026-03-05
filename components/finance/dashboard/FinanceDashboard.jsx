'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2, Wallet } from 'lucide-react'
import KPICards from './KPICards'
import RevenueOverview from './RevenueOverview'
import ExpenseSummary from './ExpenseSummary'
import CashFlowSummary from './CashFlowSummary'
import MonthlyComparisonChart from './MonthlyComparisonChart'
import RecentFinancialActivity from './RecentFinancialActivity'
import GraphicalReports from './GraphicalReports'
import QuickNavigation from './QuickNavigation'
import ExportSnapshot from './ExportSnapshot'

export default function FinanceDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  const loadData = async () => {
    if (!effectiveHotelId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const params = new URLSearchParams()
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      const url = `http://localhost:5000/api/hotel-data/${effectiveHotelId}/finance-dashboard?${params.toString()}`
      const res = await fetch(url, { headers })
      if (res.ok) {
        const json = await res.json()
        setData(json)
        if (json.byMonth?.length && !selectedMonth) setSelectedMonth(json.byMonth[json.byMonth.length - 1]?.month || '')
      }
    } catch (error) {
      console.error('Finance dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [effectiveHotelId, startDate, endDate])

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Wallet className="h-14 w-14 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select a hotel or log in with a hotel account to view the finance dashboard.</p>
        </div>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading finance dashboard...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
          <p className="text-gray-600 mt-1">Revenue, expenses, and cash flow at a glance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <KPICards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueOverview data={data} revenueByDay={data?.revenueByDay} />
        <ExpenseSummary data={data} totalRevenue={data?.totalRevenue} />
        <CashFlowSummary data={data} />
      </div>

      <MonthlyComparisonChart byMonth={data?.byMonth} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFinancialActivity recentActivity={data?.recentActivity} />
        <div className="space-y-4">
          <GraphicalReports
            revenueByDay={data?.revenueByDay}
            expenseByCategory={data?.expenseByCategory}
            byMonth={data?.byMonth}
          />
          <QuickNavigation onExportClick={() => document.getElementById('export-snapshot')?.scrollIntoView({ behavior: 'smooth' })} />
          <div id="export-snapshot">
            <ExportSnapshot data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
