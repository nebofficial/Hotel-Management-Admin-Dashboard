'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CommissionTypeSelector } from './CommissionTypeSelector'
import { calculateCommission } from '@/services/api/commissionApi'

export function CommissionRuleForm({ apiBase, onCreated }) {
  const [name, setName] = useState('')
  const [serviceType, setServiceType] = useState('ROOM')
  const [commissionType, setCommissionType] = useState('PERCENT')
  const [value, setValue] = useState('')
  const [previewAmount, setPreviewAmount] = useState('1000')
  const [previewResult, setPreviewResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // live preview (client-side only)
  useEffect(() => {
    const amt = parseFloat(previewAmount) || 0
    const v = parseFloat(value) || 0
    if (!amt || !v) {
      setPreviewResult(null)
      return
    }
    let commissionAmount = 0
    if (commissionType === 'PERCENT') {
      commissionAmount = (amt * v) / 100
    } else {
      commissionAmount = v
    }
    setPreviewResult({
      baseAmount: amt,
      commissionAmount,
    })
  }, [previewAmount, value, commissionType])

  const handleSubmit = async () => {
    if (!apiBase || !name || !value) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name,
        serviceType,
        commissionType,
        value: parseFloat(value),
      }
      const res = await import('@/services/api/commissionApi').then((m) => m.createCommissionRule(apiBase, payload))
      onCreated?.(res.rule)
      setName('')
      setValue('')
      setPreviewResult(null)
    } catch (err) {
      setError(err?.message || 'Failed to save rule')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm bg-gradient-to-br from-sky-50 to-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-900">Commission Rule Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <Label className="text-[11px]">Rule Name</Label>
          <Input
            className="h-8 text-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Restaurant Upsell 3%"
          />
        </div>
        <div>
          <Label className="text-[11px]">Service / Product</Label>
          <select
            className="h-8 w-full rounded-md border text-xs mt-1"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="ROOM">Room Upgrade</option>
            <option value="RESTAURANT">Restaurant Upsell</option>
            <option value="SPA">Spa Service</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">Commission Type</Label>
          <CommissionTypeSelector value={commissionType} onChange={setCommissionType} />
        </div>
        <div>
          <Label className="text-[11px]">
            {commissionType === 'PERCENT' ? 'Commission Percentage (%)' : 'Fixed Commission Amount'}
          </Label>
          <Input
            type="number"
            min={0}
            className="h-8 text-xs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={commissionType === 'PERCENT' ? 'e.g. 3' : 'e.g. 200'}
          />
        </div>
        <div className="pt-2 border-t border-sky-100">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[11px]">Commission Preview (Orange)</Label>
            <input
              type="number"
              min={0}
              className="h-7 w-24 rounded-md border text-[11px] px-2"
              value={previewAmount}
              onChange={(e) => setPreviewAmount(e.target.value)}
            />
          </div>
          {previewResult ? (
            <div className="text-[11px] rounded-md bg-orange-50 border border-orange-200 px-2 py-1.5 flex justify-between">
              <span>Service Amount: {previewResult.baseAmount.toLocaleString()}</span>
              <span>
                Commission: <span className="font-semibold text-orange-700">{previewResult.commissionAmount.toLocaleString()}</span>
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">Enter commission value to see preview.</p>
          )}
        </div>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
        <Button
          type="button"
          size="sm"
          className="h-8 text-xs"
          disabled={!name || !value || saving}
          onClick={handleSubmit}
        >
          {saving ? 'Saving...' : 'Save Rule'}
        </Button>
      </CardContent>
    </Card>
  )
}

