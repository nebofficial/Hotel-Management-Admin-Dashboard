'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Clock } from 'lucide-react'
import Link from 'next/link'

export default function PendingOrders({ pendingCount = 0, orders = [] }) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Pending Orders</p>
            <p className="text-4xl font-bold">{pendingCount}</p>
            <Link
              href="/inventory/orders"
              className="flex items-center gap-1 mt-2 text-purple-100 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">View Orders</span>
              <Clock className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-white/20 rounded-full p-4">
            <ShoppingCart className="h-8 w-8" />
          </div>
        </div>
        {orders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-purple-100 mb-2">Recent Orders:</p>
            <div className="space-y-1">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="text-xs text-white flex justify-between">
                  <span>{order.orderNumber}</span>
                  <span className="font-semibold">₹{order.totalAmount?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
