'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { AlertCircle, DollarSign, Calendar, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function OutstandingPaymentView({ supplier }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [outstanding, setOutstanding] = useState(0)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (supplier?.id) {
      loadOutstanding()
    }
  }, [supplier])

  const loadOutstanding = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user?.hotelId}/suppliers/${supplier.id}/outstanding-payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to load outstanding payments')
      }

      const data = await res.json()
      setOutstanding(data.outstandingAmount || 0)
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Load outstanding error:', error)
      alert('Failed to load outstanding payments')
    } finally {
      setLoading(false)
    }
  }

  if (!supplier) return null

  const getDaysOverdue = (orderDate) => {
    const days = Math.floor((new Date() - new Date(orderDate)) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertCircle className="h-5 w-5" />
          Outstanding Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border-2 border-red-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{outstanding.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-red-400" />
              </div>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No outstanding payments</p>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pending Invoices</h4>
                <div className="space-y-2">
                  {orders.map((order) => {
                    const daysOverdue = getDaysOverdue(order.orderDate)
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                {order.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Due: </span>
                                <span className={daysOverdue > 0 ? 'text-red-600 font-semibold' : ''}>
                                  {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'On time'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ₹{Number(order.totalAmount || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
