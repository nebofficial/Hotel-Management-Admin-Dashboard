'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Plus, FileText, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const navigationItems = [
  { id: 'add-item', icon: Plus, label: 'Add Item', href: '/inventory/items', color: 'from-blue-500 to-blue-600' },
  { id: 'reports', icon: FileText, label: 'View Reports', href: '/reports/inventory', color: 'from-purple-500 to-purple-600' },
  { id: 'suppliers', icon: Users, label: 'Suppliers', href: '/inventory/suppliers', color: 'from-green-500 to-green-600' },
  { id: 'stock-items', icon: Package, label: 'Stock Items', href: '/inventory/items', color: 'from-orange-500 to-orange-600' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alerts', href: '/inventory/alerts', color: 'from-red-500 to-red-600' },
]

export default function QuickNavigationCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {navigationItems.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.id} href={item.href}>
            <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group">
              <CardContent className={`p-6 bg-gradient-to-br ${item.color} text-white`}>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-3 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
