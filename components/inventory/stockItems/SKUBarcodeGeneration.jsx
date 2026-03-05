'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RefreshCw, Copy, Check } from 'lucide-react'

export default function SKUBarcodeGeneration({ name, sku, barcode, onSKUChange, onBarcodeChange, onGenerate }) {
  const [copiedSKU, setCopiedSKU] = useState(false)
  const [copiedBarcode, setCopiedBarcode] = useState(false)

  useEffect(() => {
    if (copiedSKU) {
      const timer = setTimeout(() => setCopiedSKU(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedSKU])

  useEffect(() => {
    if (copiedBarcode) {
      const timer = setTimeout(() => setCopiedBarcode(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedBarcode])

  const handleCopySKU = () => {
    if (sku) {
      navigator.clipboard.writeText(sku)
      setCopiedSKU(true)
    }
  }

  const handleCopyBarcode = () => {
    if (barcode) {
      navigator.clipboard.writeText(barcode)
      setCopiedBarcode(true)
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-900">SKU & Barcode</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onGenerate}
          className="text-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Generate
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sku" className="text-xs">SKU</Label>
          <div className="flex gap-1">
            <Input
              id="sku"
              value={sku || ''}
              onChange={(e) => onSKUChange?.(e.target.value)}
              placeholder="Auto-generated"
              className="text-sm flex-1"
              readOnly
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySKU}
              disabled={!sku}
            >
              {copiedSKU ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="barcode" className="text-xs">Barcode</Label>
          <div className="flex gap-1">
            <Input
              id="barcode"
              value={barcode || ''}
              onChange={(e) => onBarcodeChange?.(e.target.value)}
              placeholder="Auto-generated"
              className="text-sm flex-1"
              readOnly
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyBarcode}
              disabled={!barcode}
            >
              {copiedBarcode ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500">SKU and barcode are auto-generated but can be customized.</p>
    </div>
  )
}
