'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, FileText, BarChart3, Settings, Download } from 'lucide-react'

const items = [
  { id: 'add-transaction', label: 'Add Transaction', href: '/accounting/payments', icon: Plus, color: 'from-green-500 to-emerald-600' },
  { id: 'reports', label: 'View Reports', href: '/accounting/profitloss', icon: FileText, color: 'from-blue-500 to-cyan-600' },
  { id: 'analytics', label: 'Analytics', href: '/accounting/profitloss', icon: BarChart3, color: 'from-purple-500 to-violet-600' },
  { id: 'expenses', label: 'Expenses', href: '/accounting/expenses', icon: Settings, color: 'from-amber-500 to-orange-600' },
  { id: 'export', label: 'Export Snapshot', href: '#', icon: Download, color: 'from-teal-500 to-cyan-600', onClick: true },
]

export default function QuickNavigation({ onExportClick }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur">
      <CardContent className="p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Navigation</p>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const Icon = item.icon
            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={onExportClick}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            }
            return (
              <Link key={item.id} href={item.href}>
                <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${item.color} text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
