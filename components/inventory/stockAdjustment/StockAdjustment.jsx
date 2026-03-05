'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/app/auth-context'
import { Loader2, BarChart3, PieChart as PieChartIcon, Layers } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

import IncreaseDecreaseStock from './IncreaseDecreaseStock'
import PhysicalStockEntry from './PhysicalStockEntry'
import DamageAdjustment from './DamageAdjustment'
import ExpiryAdjustment from './ExpiryAdjustment'
import TheftLossEntry from './TheftLossEntry'
import ManualCorrection from './ManualCorrection'
import ApprovalWorkflow from './ApprovalWorkflow'
import AdjustmentLogs from './AdjustmentLogs'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const CHART_COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6']

export default function StockAdjustment() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [inventoryItems, setInventoryItems] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [activeTab, setActiveTab] = useState('forms')

  const loadData = async () => {
    if (!effectiveHotelId) {
      setLoading(false)
      return
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [itemsRes, adjRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items?isActive=true`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-adjustments`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (itemsRes.ok) {
        const d = await itemsRes.json()
        setInventoryItems(d.items || [])
      }
      if (adjRes.ok) {
        const d = await adjRes.json()
        setAdjustments(d.adjustments || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (effectiveHotelId) loadData()
  }, [effectiveHotelId])

  const stats = useMemo(() => {
    const all = adjustments || []
    const total = all.length
    const damage = all.filter((a) => a.adjustmentType === 'DAMAGE').length
    const expiry = all.filter((a) => a.adjustmentType === 'EXPIRY').length
    const pending = all.filter((a) => a.status === 'Pending').length
    return { total, damage, expiry, pending }
  }, [adjustments])

  const barData = useMemo(() => {
    const byMonth = {}
    ;(adjustments || []).forEach((a) => {
      const d = new Date(a.createdAt || a.requestedAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      byMonth[key] = (byMonth[key] || 0) + 1
    })
    return Object.entries(byMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([name, value]) => ({ name, value }))
  }, [adjustments])

  const pieData = useMemo(() => {
    const byType = {}
    ;(adjustments || []).forEach((a) => {
      const t = a.adjustmentType || 'OTHER'
      byType[t] = (byType[t] || 0) + 1
    })
    return Object.entries(byType).map(([name, value]) => ({ name, value }))
  }, [adjustments])

  const pendingAdjustment = (adjustments || []).find((a) => a.status === 'Pending')
  const getItemName = (id) => inventoryItems?.find((i) => i.id === id)?.name || id

  if (!effectiveHotelId) {
    return (
      <main className="p-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center text-amber-800">Select a hotel or log in with a hotel account to manage stock adjustments.</CardContent>
        </Card>
      </main>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="h-8 w-8 text-indigo-600" />
          Stock Adjustment
        </h1>
        <p className="text-gray-600 mt-1">Manage inventory adjustments, damage, expiry, theft, and physical audit</p>
      </div>

      {/* Gradient Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm font-medium">Total Adjustments</p>
            <p className="text-4xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-rose-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <p className="text-red-100 text-sm font-medium">Damage</p>
            <p className="text-4xl font-bold mt-1">{stats.damage}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <p className="text-orange-100 text-sm font-medium">Expiry</p>
            <p className="text-4xl font-bold mt-1">{stats.expiry}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-amber-500 border-0 text-white rounded-2xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <p className="text-yellow-100 text-sm font-medium">Pending Approvals</p>
            <p className="text-4xl font-bold mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="forms">Adjustment Forms</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <PhysicalStockEntry inventoryItems={inventoryItems} onCreated={loadData} />
              <DamageAdjustment inventoryItems={inventoryItems} onCreated={loadData} />
              <ExpiryAdjustment inventoryItems={inventoryItems} onCreated={loadData} />
              <TheftLossEntry inventoryItems={inventoryItems} onCreated={loadData} />
              <ManualCorrection inventoryItems={inventoryItems} onCreated={loadData} />
              {pendingAdjustment && (
                <ApprovalWorkflow
                  adjustment={pendingAdjustment}
                  itemName={getItemName(pendingAdjustment.itemId)}
                  onApproved={loadData}
                  onRejected={loadData}
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AdjustmentLogs
            adjustments={adjustments}
            items={inventoryItems}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilter={setTypeFilter}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Monthly Adjustment Trend</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No data yet</p>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><PieChartIcon className="h-5 w-5" /> Adjustment Type Distribution</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">No data yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
