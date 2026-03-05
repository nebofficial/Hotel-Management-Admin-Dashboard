'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function TaxCalculation({
  taxableBase = 0,
  gstPercent = 12,
  serviceChargeEnabled = false,
  serviceChargePercent = 0,
  cgst = 0,
  sgst = 0,
  igst = 0,
  taxTotal = 0,
  serviceChargeAmount = 0,
  onChange,
  readonly,
}) {
  const emit = (patch) => {
    onChange?.({
      gstPercent,
      serviceChargeEnabled,
      serviceChargePercent,
      ...patch,
    })
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-300 to-amber-200 text-amber-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">GST & Service Charge</CardTitle>
        <p className="text-xs text-amber-800">
          Indian GST split (CGST / SGST / IGST) and optional service charge.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-amber-900">GST (%)</Label>
            <Input
              type="number"
              min="0"
              step="0.1"
              readOnly={readonly}
              value={gstPercent}
              onChange={(e) => emit({ gstPercent: Number(e.target.value) || 0 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-amber-900">Taxable Amount (₹)</Label>
            <Input
              readOnly
              value={Number(taxableBase || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-amber-900">Tax Total (₹)</Label>
            <Input
              readOnly
              value={Number(taxTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-amber-900">CGST (₹)</Label>
            <Input
              readOnly
              value={Number(cgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-amber-900">SGST (₹)</Label>
            <Input
              readOnly
              value={Number(sgst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-amber-900">IGST (₹)</Label>
            <Input
              readOnly
              value={Number(igst || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              className="bg-white/70 border-amber-300 text-amber-900"
            />
          </div>
        </div>

        <div className="border-t border-amber-300 pt-2 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={serviceChargeEnabled}
                onCheckedChange={(v) => !readonly && emit({ serviceChargeEnabled: Boolean(v) })}
              />
              <span className="text-amber-900 font-medium">Service Charge</span>
            </div>
            <div className="flex items-center gap-1">
              <Label className="text-amber-900">%</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                readOnly={readonly || !serviceChargeEnabled}
                value={serviceChargePercent}
                onChange={(e) => emit({ serviceChargePercent: Number(e.target.value) || 0 })}
                className="w-20 bg-white/70 border-amber-300 text-amber-900"
              />
            </div>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Service Charge Amount</span>
            <span>
              ₹{Number(serviceChargeAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

