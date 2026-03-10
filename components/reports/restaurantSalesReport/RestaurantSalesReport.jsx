'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RestaurantSalesHeader } from './RestaurantSalesHeader'
import { RestaurantSalesStatsCards } from './RestaurantSalesStatsCards'
import { RestaurantSalesFilters } from './RestaurantSalesFilters'
import { DailyRestaurantSales } from './DailyRestaurantSales'
import { ItemWiseSalesReport } from './ItemWiseSalesReport'
import { CategoryWiseSalesReport } from './CategoryWiseSalesReport'
import { TopSellingItems } from './TopSellingItems'
import { PaymentMethodAnalysis } from './PaymentMethodAnalysis'
import { RestaurantSalesTrendChart } from './RestaurantSalesTrendChart'
import { RestaurantSalesExport } from './RestaurantSalesExport'
import {
  fetchRestaurantSalesSummary,
  fetchDailyRestaurantSales,
  fetchItemWiseSales,
  fetchCategoryWiseSales,
  fetchTopSellingItems,
  fetchPaymentMethodAnalysis,
  fetchRestaurantSalesTrend,
} from '@/services/api/restaurantSalesApi'

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

export default function RestaurantSalesReport() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setFilters] = useState(getDefaultRange)
  const [summary, setSummary] = useState(null)
  const [daily, setDaily] = useState([])
  const [itemWise, setItemWise] = useState([])
  const [categoryWise, setCategoryWise] = useState([])
  const [topItems, setTopItems] = useState([])
  const [paymentAnalysis, setPaymentAnalysis] = useState([])
  const [trend, setTrend] = useState([])
  const [categorySales, setCategorySales] = useState([])
  const [paymentDistribution, setPaymentDistribution] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const filters = useMemo(() => ({ startDate, endDate }), [startDate, endDate])

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [
        summaryRes,
        dailyRes,
        itemRes,
        catRes,
        topRes,
        payRes,
        trendRes,
      ] = await Promise.all([
        fetchRestaurantSalesSummary(apiBase, filters),
        fetchDailyRestaurantSales(apiBase, filters),
        fetchItemWiseSales(apiBase, filters),
        fetchCategoryWiseSales(apiBase, filters),
        fetchTopSellingItems(apiBase, filters),
        fetchPaymentMethodAnalysis(apiBase, filters),
        fetchRestaurantSalesTrend(apiBase, filters),
      ])
      setSummary(summaryRes)
      setDaily(dailyRes.daily ?? [])
      setItemWise(itemRes.itemWise ?? [])
      setCategoryWise(catRes.categoryWise ?? [])
      setTopItems(topRes.topItems ?? [])
      setPaymentAnalysis(payRes.paymentAnalysis ?? [])
      setTrend(trendRes.trend ?? [])
      setCategorySales(trendRes.categorySales ?? [])
      setPaymentDistribution(trendRes.paymentDistribution ?? [])
    } catch (err) {
      console.error('Restaurant sales report load error', err)
      setError(err?.message || 'Failed to load restaurant sales report')
      setSummary(null)
      setDaily([])
      setItemWise([])
      setCategoryWise([])
      setTopItems([])
      setPaymentAnalysis([])
      setTrend([])
      setCategorySales([])
      setPaymentDistribution([])
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
        <p className="text-gray-600 text-sm">Select a hotel to view restaurant sales report.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-900/5">
      <RestaurantSalesHeader onRefresh={load} loading={loading} />
      <RestaurantSalesFilters
        startDate={startDate}
        endDate={endDate}
        onChangeStart={(v) => setFilters((p) => ({ ...p, startDate: v || getDefaultRange().startDate }))}
        onChangeEnd={(v) => setFilters((p) => ({ ...p, endDate: v || getDefaultRange().endDate }))}
        onReset={handleReset}
      />
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      <RestaurantSalesStatsCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="daily">
            <TabsList className="bg-white border rounded-xl p-1 flex flex-wrap">
              <TabsTrigger value="daily" className="rounded-lg text-xs">Daily</TabsTrigger>
              <TabsTrigger value="itemwise" className="rounded-lg text-xs">Item-wise</TabsTrigger>
              <TabsTrigger value="category" className="rounded-lg text-xs">Category</TabsTrigger>
              <TabsTrigger value="top" className="rounded-lg text-xs">Top Items</TabsTrigger>
              <TabsTrigger value="payment" className="rounded-lg text-xs">Payment</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <DailyRestaurantSales daily={daily} loading={loading} />
            </TabsContent>
            <TabsContent value="itemwise">
              <ItemWiseSalesReport data={itemWise} loading={loading} />
            </TabsContent>
            <TabsContent value="category">
              <CategoryWiseSalesReport data={categoryWise} loading={loading} />
            </TabsContent>
            <TabsContent value="top">
              <TopSellingItems data={topItems} loading={loading} />
            </TabsContent>
            <TabsContent value="payment">
              <PaymentMethodAnalysis data={paymentAnalysis} loading={loading} />
            </TabsContent>
          </Tabs>
          <RestaurantSalesTrendChart
            trend={trend}
            categorySales={categorySales}
            paymentDistribution={paymentDistribution}
            loading={loading}
          />
        </div>
        <div className="space-y-4">
          <RestaurantSalesExport apiBase={apiBase} filters={filters} />
        </div>
      </div>
    </div>
  )
}
