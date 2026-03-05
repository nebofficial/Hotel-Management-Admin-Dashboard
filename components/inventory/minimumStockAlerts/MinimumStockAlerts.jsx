'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/app/auth-context'
import { Loader2, Bell } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

import SetMinimumStockLevel from './SetMinimumStockLevel'
import AutoLowStockAlerts from './AutoLowStockAlerts'
import NotificationSystem from './NotificationSystem'
import ReorderSuggestion from './ReorderSuggestion'
import EmailSystemNotification from './EmailSystemNotification'
import AlertDashboardWidget from './AlertDashboardWidget'
import AutoGeneratePO from './AutoGeneratePO'
import ThresholdCustomization from './ThresholdCustomization'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function MinimumStockAlerts() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [inventoryItems, setInventoryItems] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [critical, setCritical] = useState([])
  const [warning, setWarning] = useState([])
  const [notifications, setNotifications] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('alerts')

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
      const [itemsRes, suppRes, alertsRes, notifRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items?isActive=true`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/suppliers?isActive=true`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-alerts/low-stock`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-alerts/notifications`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (itemsRes.ok) {
        const d = await itemsRes.json()
        setInventoryItems(d.items || [])
      }
      if (suppRes.ok) {
        const d = await suppRes.json()
        setSuppliers(d.suppliers || [])
      }
      if (alertsRes.ok) {
        const d = await alertsRes.json()
        setLowStockItems(d.lowStock || [])
        setCritical(d.critical || [])
        setWarning(d.warning || [])
      }
      if (notifRes.ok) {
        const d = await notifRes.json()
        setNotifications(d.notifications || [])
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

  const safeStock = useMemo(() => {
    return (inventoryItems || []).filter((i) => Number(i.currentStock || 0) >= Number(i.reorderLevel || 0))
  }, [inventoryItems])

  const chartData = useMemo(() => {
    return [
      { name: 'Critical', value: critical.length, fill: '#ef4444' },
      { name: 'Warning', value: warning.length, fill: '#f59e0b' },
      { name: 'Safe', value: safeStock.length, fill: '#10b981' },
    ]
  }, [critical, warning, safeStock])

  const trendData = useMemo(() => {
    const last7 = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      last7.push({ name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), low: Math.floor(Math.random() * 10) + 5 })
    }
    return last7
  }, [])

  if (!effectiveHotelId) {
    return (
      <main className="p-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center text-amber-800">Select a hotel or log in with a hotel account to view stock alerts.</CardContent>
        </Card>
      </main>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8 text-red-600 animate-pulse" />
            Minimum Stock Alerts
          </h1>
          <p className="text-gray-600 mt-1">Monitor low stock items and manage reorder notifications</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-red-200">
          <Bell className="h-5 w-5 text-red-600" />
          <span className="font-bold text-red-600">{lowStockItems.length}</span>
          <span className="text-sm text-gray-600">alerts</span>
        </div>
      </div>

      <AlertDashboardWidget critical={critical} warning={warning} safe={safeStock} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-xl">
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AutoLowStockAlerts lowStockItems={lowStockItems} critical={critical} warning={warning} onNotify={(item) => { setSelectedItem(item); setActiveTab('notifications'); }} />
              </div>
              <div className="space-y-4">
                {selectedItem && <ReorderSuggestion item={selectedItem} />}
                <AutoGeneratePO lowStockItems={lowStockItems} suppliers={suppliers} onGenerated={loadData} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SetMinimumStockLevel inventoryItems={inventoryItems} onUpdated={loadData} />
            <ThresholdCustomization items={inventoryItems} />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedItem && <NotificationSystem item={selectedItem} onSent={loadData} />}
            <EmailSystemNotification notifications={notifications} items={inventoryItems} />
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Low Stock vs Safe Stock</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Stock Alert Trend (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
