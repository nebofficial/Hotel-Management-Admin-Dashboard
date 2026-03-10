'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { InventoryReportHeader } from './InventoryReportHeader'
import { InventorySummaryCards } from './InventorySummaryCards'
import { InventoryFilters } from './InventoryFilters'
import { CurrentStockReport } from './CurrentStockReport'
import { LowStockAlertReport } from './LowStockAlertReport'
import { StockMovementReport } from './StockMovementReport'
import { InventoryConsumptionReport } from './InventoryConsumptionReport'
import { InventoryValuationReport } from './InventoryValuationReport'
import { InventoryTrendChart } from './InventoryTrendChart'
import { InventoryExport } from './InventoryExport'
import { InventoryTable } from './InventoryTable'
import {
  fetchInventorySummary,
  fetchCurrentStock,
  fetchLowStockItems,
  fetchStockMovement,
  fetchInventoryConsumption,
  fetchInventoryValuation,
  fetchInventoryTrend,
} from '@/services/api/inventoryReportApi'

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
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) }
}

export default function InventoryReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [category, setCategory] = useState('all')
  const [summary, setSummary] = useState(null)
  const [currentStock, setCurrentStock] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [stockMovement, setStockMovement] = useState(null)
  const [consumption, setConsumption] = useState({ consumption: [], byCategory: [] })
  const [valuation, setValuation] = useState(null)
  const [trend, setTrend] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId]
  )

  const filters = useMemo(() => {
    const f = { startDate, endDate }
    if (category && category !== 'all') f.category = category
    return f
  }, [startDate, endDate, category])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [s, cs, ls, sm, cons, val, tr] = await Promise.all([
        fetchInventorySummary(apiBase, filters),
        fetchCurrentStock(apiBase, filters),
        fetchLowStockItems(apiBase, filters),
        fetchStockMovement(apiBase, filters),
        fetchInventoryConsumption(apiBase, filters),
        fetchInventoryValuation(apiBase, filters),
        fetchInventoryTrend(apiBase, filters),
      ])
      setSummary(s)
      setCurrentStock(cs?.currentStock ?? [])
      setLowStock(ls?.lowStock ?? [])
      setStockMovement(sm)
      setConsumption({ consumption: cons?.consumption ?? [], byCategory: cons?.byCategory ?? [] })
      setValuation(val)
      setTrend(tr?.trend ?? [])
      setCategoryDistribution(tr?.categoryDistribution ?? [])
      const cats = [...new Set((cs?.currentStock ?? []).map((i) => i.category).filter(Boolean))]
      setCategories(cats)
    } catch (err) {
      console.error('Inventory report load error', err)
      setError(err?.message || 'Failed to load inventory report')
      setSummary(null)
      setCurrentStock([])
      setLowStock([])
      setStockMovement(null)
      setConsumption({ consumption: [], byCategory: [] })
      setValuation(null)
      setTrend([])
      setCategoryDistribution([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, category])

  const handleReset = () => {
    setFilters(getDefaultRange())
    setCategory('all')
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view inventory report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <InventoryReportHeader onRefresh={load} loading={loading} />
      <InventoryFilters
        startDate={startDate}
        endDate={endDate}
        category={category}
        categories={categories}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onChangeCategory={setCategory}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <InventorySummaryCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <CurrentStockReport currentStock={currentStock} loading={loading} />
          <LowStockAlertReport lowStock={lowStock} loading={loading} />
          <StockMovementReport data={stockMovement} loading={loading} />
          <InventoryConsumptionReport consumption={consumption.consumption} byCategory={consumption.byCategory} loading={loading} />
          <InventoryValuationReport data={valuation} loading={loading} />
          <InventoryTrendChart trend={trend} categoryDistribution={categoryDistribution} loading={loading} />
          <InventoryTable currentStock={currentStock} loading={loading} />
        </div>
        <div className="space-y-4">
          <InventoryExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
