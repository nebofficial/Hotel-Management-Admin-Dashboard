'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, TrendingDown } from 'lucide-react'

export default function AdvancePayments({ selectedBooking, advanceTotal, balance }) {
  const advance = advanceTotal ?? 0
  const rem = balance != null ? balance : 0

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-900 text-base flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Advance / Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedBooking ? (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/80">
              <p className="text-xs text-gray-500 mb-1">Advance / Credits applied</p>
              <p className="text-xl font-bold text-blue-700">${Number(advance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/80">
              <TrendingDown className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Remaining balance</p>
                <p className={`font-bold ${rem <= 0 ? 'text-green-700' : 'text-red-700'}`}>${Number(rem).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 py-4 text-center">Select a guest to view advance & balance</p>
        )}
      </CardContent>
    </Card>
  )
}
