'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { TaxReportHeader } from './TaxReportHeader'
import { TaxSummaryCards } from './TaxSummaryCards'
import { TaxFilters } from './TaxFilters'
import { GSTVATReport } from './GSTVATReport'
import { ServiceChargeReport } from './ServiceChargeReport'
import { TaxBreakdownInvoice } from './TaxBreakdownInvoice'
import { TaxSummaryTable } from './TaxSummaryTable'
import { TaxFilingReport } from './TaxFilingReport'
import { TaxTrendChart } from './TaxTrendChart'
import { TaxExport } from './TaxExport'
import {
  fetchTaxSummary,
  fetchGSTVATReport,
  fetchServiceChargeReport,
  fetchTaxBreakdownByInvoice,
  fetchTaxFilingReport,
  fetchTaxTrend,
} from '@/services/api/taxReportApi'

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

export default function TaxReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [taxType, setTaxType] = useState('all')
  const [summary, setSummary] = useState(null)
  const [gstVat, setGstVat] = useState(null)
  const [serviceCharge, setServiceCharge] = useState(null)
  const [breakdown, setBreakdown] = useState([])
  const [filing, setFiling] = useState(null)
  const [trend, setTrend] = useState([])
  const [taxDistribution, setTaxDistribution] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId]
  )

  const filters = useMemo(() => ({ startDate, endDate }), [startDate, endDate])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [s, g, sc, b, f, t] = await Promise.all([
        fetchTaxSummary(apiBase, filters),
        fetchGSTVATReport(apiBase, filters),
        fetchServiceChargeReport(apiBase, filters),
        fetchTaxBreakdownByInvoice(apiBase, filters),
        fetchTaxFilingReport(apiBase, filters),
        fetchTaxTrend(apiBase, filters),
      ])
      setSummary(s)
      setGstVat(g)
      setServiceCharge(sc)
      setBreakdown(b?.breakdown ?? [])
      setFiling(f)
      setTrend(t?.trend ?? [])
      setTaxDistribution(t?.taxDistribution ?? [])
    } catch (err) {
      console.error('Tax report load error', err)
      setError(err?.message || 'Failed to load tax report')
      setSummary(null)
      setGstVat(null)
      setServiceCharge(null)
      setBreakdown([])
      setFiling(null)
      setTrend([])
      setTaxDistribution([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate])

  const handleReset = () => setFilters(getDefaultRange())

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view tax report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <TaxReportHeader onRefresh={load} loading={loading} />
      <TaxFilters
        startDate={startDate}
        endDate={endDate}
        taxType={taxType}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onChangeTaxType={setTaxType}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <TaxSummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <GSTVATReport data={gstVat} loading={loading} />
          <ServiceChargeReport data={serviceCharge} loading={loading} />
          <TaxBreakdownInvoice breakdown={breakdown} loading={loading} />
          <TaxTrendChart trend={trend} taxDistribution={taxDistribution} loading={loading} />
        </div>
        <div className="space-y-4">
          <TaxSummaryTable summary={summary} loading={loading} />
          <TaxFilingReport data={filing} loading={loading} />
          <TaxExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
