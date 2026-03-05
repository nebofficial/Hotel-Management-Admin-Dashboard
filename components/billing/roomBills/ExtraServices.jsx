'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'

const SERVICE_PRESETS = ['Mini Bar', 'Laundry', 'Room Service', 'Spa', 'Other']

export default function ExtraServices({ extras = [], onChange, readonly }) {
  const handleAdd = () => {
    if (readonly) return
    const next = [
      ...extras,
      { id: crypto.randomUUID(), name: 'Mini Bar', category: 'MINIBAR', qty: 1, rate: 0, amount: 0 },
    ]
    onChange?.(next)
  }

  const handleUpdate = (id, field, value) => {
    if (readonly) return
    const next = extras.map((row) => {
      if (row.id !== id) return row
      const updated = { ...row, [field]: value }
      const qty = Number(updated.qty || 0)
      const rate = Number(updated.rate || 0)
      updated.amount = Number.isFinite(qty * rate) ? qty * rate : 0
      return updated
    })
    onChange?.(next)
  }

  const handleRemove = (id) => {
    if (readonly) return
    onChange?.(extras.filter((x) => x.id !== id))
  }

  const subtotal = extras.reduce((s, e) => s + Number(e.amount || 0), 0)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Extra Services</CardTitle>
        <p className="text-purple-100 text-xs">Mini bar, laundry, room service, spa and more.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-purple-50">Add services used during stay.</span>
          {!readonly && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-white/60 text-white bg-white/10 hover:bg-white/20 text-xs"
              onClick={handleAdd}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Service
            </Button>
          )}
        </div>

        <Table className="text-xs text-white">
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-white/90">Service</TableHead>
              <TableHead className="text-right text-white/90">Qty</TableHead>
              <TableHead className="text-right text-white/90">Rate (₹)</TableHead>
              <TableHead className="text-right text-white/90">Amount (₹)</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.map((row) => (
              <TableRow key={row.id} className="border-white/10">
                <TableCell className="pr-2">
                  <Input
                    value={row.name || ''}
                    readOnly={readonly}
                    list="service-presets"
                    onChange={(e) => handleUpdate(row.id, 'name', e.target.value)}
                    className="h-7 text-xs bg-white/10 border-white/30 text-white placeholder:text-purple-100"
                    placeholder="Service name"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    readOnly={readonly}
                    value={row.qty ?? 1}
                    onChange={(e) => handleUpdate(row.id, 'qty', Number(e.target.value) || 0)}
                    className="h-7 text-xs bg-white/10 border-white/30 text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    readOnly={readonly}
                    value={row.rate ?? 0}
                    onChange={(e) => handleUpdate(row.id, 'rate', Number(e.target.value) || 0)}
                    className="h-7 text-xs bg-white/10 border-white/30 text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  ₹{Number(row.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  {!readonly && (
                    <button
                      type="button"
                      onClick={() => handleRemove(row.id)}
                      className="text-white/70 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {extras.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="py-4 text-center text-purple-100">
                  No extra services added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <datalist id="service-presets">
          {SERVICE_PRESETS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <div className="border-t border-white/30 pt-2 flex justify-between text-sm font-semibold">
          <span>Extras Total</span>
          <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </CardContent>
    </Card>
  )
}

