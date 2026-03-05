'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function TaxConfiguration({ settings, onChange }) {
  const s = settings || {}

  const update = (field, value) => {
    onChange?.({ ...s, [field]: value })
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tax Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-50">Enable GST</span>
          <button
            type="button"
            onClick={() => update('gstEnabled', !s.gstEnabled)}
            className={`w-10 h-5 rounded-full flex items-center px-1 ${
              s.gstEnabled ? 'bg-white' : 'bg-emerald-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-emerald-600 transition-transform ${
                s.gstEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-emerald-50">Default GST %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.defaultGstRate ?? 18}
              onChange={(e) => update('defaultGstRate', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
          <div>
            <Label className="text-xs text-emerald-50">IGST %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.igstPercent ?? 18}
              onChange={(e) => update('igstPercent', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-emerald-50">CGST %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.cgstPercent ?? 9}
              onChange={(e) => update('cgstPercent', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
          <div>
            <Label className="text-xs text-emerald-50">SGST %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.sgstPercent ?? 9}
              onChange={(e) => update('sgstPercent', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-emerald-50">Service Charge (Room) %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.serviceChargeRoom ?? 0}
              onChange={(e) => update('serviceChargeRoom', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
          <div>
            <Label className="text-xs text-emerald-50">Service Charge (Restaurant) %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={s.serviceChargeRestaurant ?? 0}
              onChange={(e) => update('serviceChargeRestaurant', Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

