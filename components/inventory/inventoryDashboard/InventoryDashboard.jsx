'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import TotalItemsOverview from './TotalItemsOverview'
import LowStockItemsCount from './LowStockItemsCount'
import PendingOrders from './PendingOrders'
import InventoryValueSummary from './InventoryValueSummary'
import OverviewChart from './OverviewChart'
import RealTimeDataUpdates from './RealTimeDataUpdates'
import GraphicalCharts from './GraphicalCharts'
import MonthlyStockComparison from './MonthlyStockComparison'
import QuickNavigationCards from './QuickNavigationCards'
import ExportSummary from './ExportSummary'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function InventoryDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  const fetchData = async () => {
    if (!effectiveHotelId) {
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [itemsRes, ordersRes, suppliersRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/suppliers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const itemsData = itemsRes.ok ? await itemsRes.json().catch(() => ({})) : {}
      const ordersData = ordersRes.ok ? await ordersRes.json().catch(() => ({})) : {}
      const suppliersData = suppliersRes.ok ? await suppliersRes.json().catch(() => ({})) : {}

      setItems((itemsData.items || []).map((item) => ({
        id: String(item.id),
        name: String(item.name || ''),
        category: item.category ? String(item.category) : null,
        unit: item.unit ? String(item.unit) : null,
        currentStock: Number(item.currentStock || 0),
        reorderLevel: Number(item.reorderLevel || 0),
        unitPrice: Number(item.unitPrice || 0),
        isActive: Boolean(item.isActive),
      })))

      setOrders((ordersData.orders || []).map((order) => ({
        id: String(order.id),
        orderNumber: String(order.orderNumber || ''),
        status: String(order.status || 'Pending'),
        totalAmount: Number(order.totalAmount || 0),
        orderDate: order.orderDate ? String(order.orderDate) : null,
      })))

      setSuppliers(suppliersData.suppliers || [])
      setLastUpdate(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (effectiveHotelId) {
      fetchData()
    }
  }, [effectiveHotelId])

  const metrics = useMemo(() => {
    const activeItems = items.filter((item) => item.isActive)
    const lowStockItems = activeItems.filter((item) => item.currentStock < item.reorderLevel)
    const totalValue = activeItems.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0)
    const pendingOrders = orders.filter((order) => order.status === 'Pending')

    return {
      totalItems: activeItems.length,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.slice(0, 5),
      pendingCount: pendingOrders.length,
      pendingOrders: pendingOrders.slice(0, 5),
      totalValue,
    }
  }, [items, orders])

  const chartData = useMemo(() => {
    const categoryMap = new Map()
    items
      .filter((item) => item.isActive)
      .forEach((item) => {
        const category = item.category || 'Uncategorized'
        const current = categoryMap.get(category) || 0
        categoryMap.set(category, current + item.currentStock)
      })
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))
  }, [items])

  const monthlyComparison = useMemo(() => {
    // Mock data for comparison - in real app, fetch historical data
    return chartData.map((item) => ({
      name: item.name,
      value: item.value,
    }))
  }, [chartData])

  const handleExportPDF = () => {
    // Implement PDF export
    alert('PDF export functionality will be implemented')
  }

  const handleExportExcel = () => {
    // Implement Excel export
    alert('Excel export functionality will be implemented')
  }

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select a hotel or log in with a hotel account to view inventory dashboard.</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (loading && items.length === 0) {
    return (
      <main className="p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory data...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory & Store Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Comprehensive overview of your inventory management</p>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-2 text-red-800 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      <RealTimeDataUpdates onRefresh={fetchData} lastUpdate={lastUpdate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalItemsOverview totalItems={metrics.totalItems} change={0} />
        <LowStockItemsCount lowStockCount={metrics.lowStockCount} items={metrics.lowStockItems} />
        <PendingOrders pendingCount={metrics.pendingCount} orders={metrics.pendingOrders} />
        <InventoryValueSummary totalValue={metrics.totalValue} change={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverviewChart data={chartData} chartType="bar" />
        <GraphicalCharts data={chartData} />
      </div>

      <MonthlyStockComparison currentMonth={monthlyComparison} previousMonth={[]} />

      <QuickNavigationCards />

      <ExportSummary onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} loading={false} />
    </main>
  )
}
