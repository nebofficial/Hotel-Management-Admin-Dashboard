'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RefundTypeSelector({ type, onChange }) {
  return (
    <Card className="border border-purple-200 bg-gradient-to-br from-purple-50/80 to-violet-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Refund Type</h3>
        <p className="text-xs text-slate-600">Choose full bill cancellation or partial refund.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange?.('full')}
            className={`flex-1 rounded-lg border-2 px-2 py-2 text-xs font-medium ${
              type === 'full'
                ? 'border-purple-600 bg-purple-100 text-purple-800'
                : 'border-slate-200 bg-white hover:border-purple-300 text-slate-700'
            }`}
          >
            Full Bill Cancellation
          </button>
          <button
            type="button"
            onClick={() => onChange?.('partial')}
            className={`flex-1 rounded-lg border-2 px-2 py-2 text-xs font-medium ${
              type === 'partial'
                ? 'border-purple-600 bg-purple-100 text-purple-800'
                : 'border-slate-200 bg-white hover:border-purple-300 text-slate-700'
            }`}
          >
            Partial Refund
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

