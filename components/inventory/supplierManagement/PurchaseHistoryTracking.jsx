'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { Package, TrendingUp, Calendar, DollarSign, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PurchaseHistoryTracking({ supplier }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    averageOrderValue: 0,
    lastOrderDate: null,
  })
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    if (supplier?.id) {
      loadHistory()
    }
  }, [supplier])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user?.hotelId}/suppliers/${supplier.id}/purchase-history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to load purchase history')
      }

      const data = await res.json()
      const orders = data.orders || []
      
      const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0)
      const completedOrders = orders.filter((o) => o.status === 'Received')
      
      setStats({
        totalOrders: orders.length,
        totalAmount,
        averageOrderValue: orders.length > 0 ? totalAmount / orders.length : 0,
        lastOrderDate: orders.length > 0 ? orders[0].orderDate : null,
      })
      
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Load history error:', error)
      alert('Failed to load purchase history')
    } finally {
      setLoading(false)
    }
  }

  if (!supplier) return null

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-900">
          <TrendingUp className="h-5 w-5" />
          Purchase Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Total Value</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg Order</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Last Order</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {stats.lastOrderDate
                    ? new Date(stats.lastOrderDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            {recentOrders.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recent Orders</h4>
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
