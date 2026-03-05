'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/app/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import DateFilter from './DateFilter'
import PropertyFilter from './PropertyFilter'
import KPISection from './KPISection'
import PaymentStatusSummary from './PaymentStatusSummary'
import BillingOverviewChart from './BillingOverviewChart'
import RefundSummary from './RefundSummary'
import RecentTransactions from './RecentTransactions'
import BillingDashboardExport from './BillingDashboardExport'

const REFRESH_INTERVAL_MS = 45000

export default function BillingDashboard() {
  const { user, hotel } = useAuth()
  const router = useRouter()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [propertyId, setPropertyId] = useState('all')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const load = useCallback(async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      params.set('period', period)
      if (period === 'custom' && startDate && endDate) {
        params.set('startDate', startDate)
        params.set('endDate', endDate)
      }
      const res = await fetch(`${apiBase}/billing-dashboard?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.message || 'Failed to load billing dashboard')
      setData(json)
    } catch (e) {
      alert(e.message || 'Failed to load billing dashboard')
    } finally {
      setLoading(false)
    }
  }, [apiBase, period, startDate, endDate])

  useEffect(() => {
    if (apiBase) load()
  }, [apiBase, load])

  useEffect(() => {
    if (!apiBase || !data) return
    const t = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(t)
  }, [apiBase, load, data])

  const handlePeriodChange = (p) => {
    setPeriod(p)
    if (p === 'custom') {
      const today = new Date().toISOString().slice(0, 10)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      setStartDate(weekAgo.toISOString().slice(0, 10))
      setEndDate(today)
    }
  }

  const handleCustomRange = ({ startDate: s, endDate: e }) => {
    setStartDate(s || '')
    setEndDate(e || '')
  }

  const handleKPIClick = (href) => {
    router.push(href)
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to view Billing Dashboard.</p>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading Billing Dashboard…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-violet-50/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of bills, payments, revenue, refunds, and transactions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <DateFilter
            value={period}
            onChange={handlePeriodChange}
            startDate={startDate}
            endDate={endDate}
            onCustomChange={handleCustomRange}
            onApply={load}
          />
          <PropertyFilter value={propertyId} onChange={setPropertyId} properties={[]} />
        </div>
      </div>

      {data && (
        <>
          <KPISection kpis={data.kpis} onClick={handleKPIClick} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PaymentStatusSummary paymentStatus={data.paymentStatus} />
            <BillingOverviewChart revenue={data.revenue} />
            <BillingDashboardExport
              data={data}
              startDate={data.startDate}
              endDate={data.endDate}
            />
          </div>

          <RefundSummary refundCreditNote={data.refundCreditNote} kpis={data.kpis} />

          <RecentTransactions transactions={data.recentTransactions} />
        </>
      )}
    </div>
  )
}
