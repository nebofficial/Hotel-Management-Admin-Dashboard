'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LowStockItemsCount({ lowStockCount = 0, items = [] }) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Low Stock Items</p>
            <p className="text-4xl font-bold">{lowStockCount}</p>
            <Link
              href="/inventory/alerts"
              className="flex items-center gap-1 mt-2 text-orange-100 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">View Alerts</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-white/20 rounded-full p-4 animate-pulse">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>
        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-orange-100 mb-2">Critical Items:</p>
            <div className="space-y-1">
              {items.slice(0, 3).map((item) => (
                <div key={item.id} className="text-xs text-white flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.currentStock} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
