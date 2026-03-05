'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

export default function PendingTransferList({ transfers, locations, onSelectTransfer }) {
  const pending = transfers?.filter((t) => t.status === 'Pending') || []
  const getLocationName = (id) => locations?.find((l) => l.id === id)?.name || id

  return (
    <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-900 text-base">
          <Clock className="h-5 w-5" />
          Pending Transfer Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {pending.length === 0 && (
            <p className="text-center text-gray-500 py-4">No pending transfers</p>
          )}
          {pending.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-3 border border-gray-200 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-900">{t.transferNumber}</p>
                <p className="text-sm text-gray-600">
                  {getLocationName(t.fromLocationId)} → {getLocationName(t.toLocationId)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectTransfer(t)}
                className="border-rose-300 text-rose-700"
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
