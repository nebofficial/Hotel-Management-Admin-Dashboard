'use client'

import { useState } from 'react'
import type { DeliveryChargesConfig } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { IndianRupee } from 'lucide-react'

type Props = {
  configs: DeliveryChargesConfig[]
  onCreateConfig: (p: Partial<DeliveryChargesConfig>) => Promise<unknown>
  onUpdateConfig: (id: string, p: Partial<DeliveryChargesConfig>) => Promise<unknown>
}

export default function DeliveryChargesSetup(props: Props) {
  const { configs, onCreateConfig, onUpdateConfig } = props
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DeliveryChargesConfig | null>(null)
  const [form, setForm] = useState({
    chargeType: 'fixed' as 'fixed' | 'distance',
    fixedAmount: '',
    perKmRate: '',
    freeDeliveryAbove: '',
    isActive: true,
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreate = () => {
    setForm({ chargeType: 'fixed', fixedAmount: '', perKmRate: '', freeDeliveryAbove: '', isActive: true, notes: '' })
    setEditing(null)
    setOpen(true)
    setError(null)
  }

  const openEdit = (c: DeliveryChargesConfig) => {
    setForm({
      chargeType: c.chargeType,
      fixedAmount: c.fixedAmount != null ? String(c.fixedAmount) : '',
      perKmRate: c.perKmRate != null ? String(c.perKmRate) : '',
      freeDeliveryAbove: c.freeDeliveryAbove != null ? String(c.freeDeliveryAbove) : '',
      isActive: c.isActive,
      notes: c.notes || '',
    })
    setEditing(c)
    setOpen(true)
    setError(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        chargeType: form.chargeType,
        fixedAmount: form.chargeType === 'fixed' ? Number(form.fixedAmount) || 0 : 0,
        perKmRate: form.chargeType === 'distance' && form.perKmRate ? Number(form.perKmRate) : null,
        freeDeliveryAbove: form.freeDeliveryAbove ? Number(form.freeDeliveryAbove) : null,
        isActive: form.isActive,
        notes: form.notes.trim() || null,
      }
      if (editing) {
        await onUpdateConfig(editing.id, payload)
      } else {
        await onCreateConfig(payload)
      }
      setOpen(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          Delivery Charges Setup
        </CardTitle>
        <p className="text-xs text-slate-500">Configure fixed or distance-based delivery charges.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" onClick={openCreate}>Add config</Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Fixed</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Per km</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Free above</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Active</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {configs.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2"><Badge variant="outline">{c.chargeType}</Badge></td>
                  <td className="px-3 py-2">{Number(c.fixedAmount).toFixed(0)}</td>
                  <td className="px-3 py-2">{c.perKmRate != null ? Number(c.perKmRate).toFixed(2) : '-'}</td>
                  <td className="px-3 py-2">{c.freeDeliveryAbove != null ? Number(c.freeDeliveryAbove).toFixed(0) : '-'}</td>
                  <td className="px-3 py-2">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="sm" className="h-7" onClick={() => openEdit(c)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {configs.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No config. Add one above.</p>}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} delivery charges</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Type</Label>
            <select
              value={form.chargeType}
              onChange={(e) => setForm((f) => ({ ...f, chargeType: e.target.value as 'fixed' | 'distance' }))}
              className="border rounded px-2 py-1.5 text-sm"
            >
              <option value="fixed">Fixed</option>
              <option value="distance">Distance</option>
            </select>
            <Label>Fixed amount</Label>
            <Input type="number" min={0} value={form.fixedAmount} onChange={(e) => setForm((f) => ({ ...f, fixedAmount: e.target.value }))} />
            {form.chargeType === 'distance' && (
              <>
                <Label>Per km rate</Label>
                <Input type="number" min={0} value={form.perKmRate} onChange={(e) => setForm((f) => ({ ...f, perKmRate: e.target.value }))} />
              </>
            )}
            <Label>Free delivery above order</Label>
            <Input type="number" min={0} value={form.freeDeliveryAbove} onChange={(e) => setForm((f) => ({ ...f, freeDeliveryAbove: e.target.value }))} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="dc-active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
              <Label htmlFor="dc-active">Active</Label>
            </div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
