'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, DollarSign } from 'lucide-react'

export default function OutstandingDues({ outstanding, onCollect }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-900 text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Outstanding Dues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {(outstanding || []).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-red-100">
              <div>
                <p className="font-semibold text-gray-900">{item.guestName}</p>
                <p className="text-xs text-gray-500">Room {item.roomNumber} · Check-out {item.checkOut ? new Date(item.checkOut).toLocaleDateString() : ''}</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="font-bold text-red-700">${Number(item.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => onCollect?.(item)}>
                  Collect
                </Button>
              </div>
            </div>
          ))}
          {(!outstanding || outstanding.length === 0) && <p className="text-sm text-gray-500 py-4 text-center">No outstanding dues</p>}
        </div>
      </CardContent>
    </Card>
  )
}
