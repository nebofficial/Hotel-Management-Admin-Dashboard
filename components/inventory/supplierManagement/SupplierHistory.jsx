'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { History, Package, Calendar, DollarSign, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupplierHistory({ supplier }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

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
      setHistory(data.orders || [])
    } catch (error) {
      console.error('Load history error:', error)
      alert('Failed to load purchase history')
    } finally {
      setLoading(false)
    }
  }

  if (!supplier) return null

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Approved: 'bg-blue-100 text-blue-700',
      Ordered: 'bg-purple-100 text-purple-700',
      Received: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <History className="h-5 w-5" />
          Purchase History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No purchase history found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-indigo-600" />
                      <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Items: </span>
                        <span>{Array.isArray(order.items) ? order.items.length : 0}</span>
                      </div>
                      {order.expectedDeliveryDate && (
                        <div>
                          <span className="text-gray-500">Expected: </span>
                          <span>{new Date(order.expectedDeliveryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
