'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { ExpenseReportHeader } from './ExpenseReportHeader'
import { ExpenseSummaryCards } from './ExpenseSummaryCards'
import { ExpenseFilters } from './ExpenseFilters'
import { DailyExpenseReport } from './DailyExpenseReport'
import { MonthlyExpenseReport } from './MonthlyExpenseReport'
import { DepartmentExpenseReport } from './DepartmentExpenseReport'
import { VendorPaymentsReport } from './VendorPaymentsReport'
import { ExpenseTrendChart } from './ExpenseTrendChart'
import { ExpenseExport } from './ExpenseExport'
import { ExpenseDetailsTable } from './ExpenseDetailsTable'
import {
  fetchExpenseSummary,
  fetchDailyExpenses,
  fetchMonthlyExpenses,
  fetchDepartmentExpenses,
  fetchVendorPayments,
  fetchExpenseTrend,
  fetchExpenseDetails,
} from '@/services/api/expenseReportApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 29)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function ExpenseReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [category, setCategory] = useState('all')
  const [department, setDepartment] = useState('all')
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState([])
  const [monthly, setMonthly] = useState([])
  const [departmentExpenses, setDepartmentExpenses] = useState([])
  const [vendorPayments, setVendorPayments] = useState([])
  const [trend, setTrend] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [deptChart, setDeptChart] = useState([])
  const [breakdown, setBreakdown] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId]
  )

  const filters = useMemo(() => {
    const f = { startDate, endDate }
    if (category && category !== 'all') f.category = category
    if (department && department !== 'all') f.department = department
    return f
  }, [startDate, endDate, category, department])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [s, d, m, dept, v, t, details] = await Promise.all([
        fetchExpenseSummary(apiBase, filters),
        fetchDailyExpenses(apiBase, filters),
        fetchMonthlyExpenses(apiBase, filters),
        fetchDepartmentExpenses(apiBase, filters),
        fetchVendorPayments(apiBase, filters),
        fetchExpenseTrend(apiBase, filters),
        fetchExpenseDetails(apiBase, filters),
      ])
      setSummary(s)
      setDaily(d?.daily ?? [])
      setMonthly(m?.monthly ?? [])
      setDepartmentExpenses(dept?.departmentExpenses ?? [])
      setVendorPayments(v?.vendorPayments ?? [])
      setTrend(t?.trend ?? [])
      setCategoryDistribution(t?.categoryDistribution ?? [])
      setDeptChart(t?.departmentExpenses ?? [])
      setBreakdown(details?.breakdown ?? [])
    } catch (err) {
      console.error('Expense report load error', err)
      setError(err?.message || 'Failed to load expense report')
      setSummary(null)
      setDaily([])
      setMonthly([])
      setDepartmentExpenses([])
      setVendorPayments([])
      setTrend([])
      setCategoryDistribution([])
      setDeptChart([])
      setBreakdown([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, category, department])

  const handleReset = () => {
    setFilters(getDefaultRange())
    setCategory('all')
    setDepartment('all')
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view expense report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <ExpenseReportHeader onRefresh={load} loading={loading} />
      <ExpenseFilters
        startDate={startDate}
        endDate={endDate}
        category={category}
        department={department}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onChangeCategory={setCategory}
        onChangeDepartment={setDepartment}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <ExpenseSummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <DailyExpenseReport daily={daily} loading={loading} />
          <MonthlyExpenseReport monthly={monthly} loading={loading} />
          <DepartmentExpenseReport departmentExpenses={departmentExpenses} loading={loading} />
          <VendorPaymentsReport vendorPayments={vendorPayments} loading={loading} />
          <ExpenseTrendChart
            trend={trend}
            categoryDistribution={categoryDistribution}
            departmentExpenses={deptChart}
            loading={loading}
          />
          <ExpenseDetailsTable breakdown={breakdown} loading={loading} />
        </div>
        <div className="space-y-4">
          <ExpenseExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
