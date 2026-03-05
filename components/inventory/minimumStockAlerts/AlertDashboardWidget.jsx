'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, TrendingDown } from 'lucide-react'

export default function AlertDashboardWidget({ critical, warning, safe }) {
  const criticalCount = critical?.length || 0
  const warningCount = warning?.length || 0
  const safeCount = safe?.length || 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-red-500 to-rose-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 animate-pulse" /> Critical Items
              </p>
              <p className="text-5xl font-bold mt-2">{criticalCount}</p>
            </div>
            <TrendingDown className="h-12 w-12 text-red-200 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Warning Level</p>
              <p className="text-5xl font-bold mt-2">{warningCount}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-orange-200 opacity-50" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Safe Stock</p>
              <p className="text-5xl font-bold mt-2">{safeCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-400/30 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-green-300"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
