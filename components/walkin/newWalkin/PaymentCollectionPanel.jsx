'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Wallet, CreditCard, Smartphone, Building2, Banknote } from 'lucide-react'

const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'card', label: 'Card', icon: CreditCard },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
]

export default function PaymentCollectionPanel({ value, onChange, totalAmount }) {
  const v = value || {}
  const set = (patch) => onChange && onChange({ ...v, ...patch })

  const total = Number(totalAmount || 0)
  const paid = Number(v.paidAmount || 0)
  const balance = Math.max(0, total - paid)

  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Wallet className="h-5 w-5" />
          Payment Collection
        </CardTitle>
        <p className="text-white/80 text-sm">Collect full or partial payment</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="space-y-4">
          <div>
            <Label className="text-white/90 text-sm">Payment Type</Label>
            <RadioGroup
              value={v.paymentType || 'full'}
              onValueChange={(val) => {
                set({
                  paymentType: val,
                  paidAmount: val === 'full' ? total : v.paidAmount || 0,
                })
              }}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="full"
                  id="full"
                  className="border-white text-white"
                />
                <Label htmlFor="full" className="text-white cursor-pointer">
                  Full Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="partial"
                  id="partial"
                  className="border-white text-white"
                />
                <Label htmlFor="partial" className="text-white cursor-pointer">
                  Partial Payment
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-white/90 text-sm">Payment Mode</Label>
            <Select value={v.paymentMode || 'cash'} onValueChange={(val) => set({ paymentMode: val })}>
              <SelectTrigger className="mt-1 bg-white/15 text-white border-white/20 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex items-center gap-2">
                      <m.icon className="h-4 w-4" />
                      {m.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white/90 text-sm">Amount Paid</Label>
            <Input
              type="number"
              min={0}
              max={total}
              value={v.paidAmount || 0}
              onChange={(e) => set({ paidAmount: Math.min(total, Math.max(0, Number(e.target.value || 0))) })}
              className="mt-1 bg-white/15 text-white border-white/20 h-10 focus:bg-white/25 text-lg font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-white/70 text-xs mb-1">Total</div>
              <div className="font-bold text-lg">₹{formatCurrency(total)}</div>
            </div>
            <div className="bg-green-500/30 rounded-lg p-3 text-center border border-green-400/50">
              <div className="text-green-200 text-xs mb-1">Paid</div>
              <div className="font-bold text-lg text-green-100">₹{formatCurrency(paid)}</div>
            </div>
            <div className={`rounded-lg p-3 text-center border ${
              balance > 0 ? 'bg-red-500/30 border-red-400/50' : 'bg-green-500/30 border-green-400/50'
            }`}>
              <div className={`text-xs mb-1 ${balance > 0 ? 'text-red-200' : 'text-green-200'}`}>Balance</div>
              <div className={`font-bold text-lg ${balance > 0 ? 'text-red-100' : 'text-green-100'}`}>
                ₹{formatCurrency(balance)}
              </div>
            </div>
          </div>

          {v.paymentMode === 'card' && (
            <div>
              <Label className="text-white/90 text-sm">Card Last 4 Digits (Optional)</Label>
              <Input
                maxLength={4}
                value={v.cardLast4 || ''}
                onChange={(e) => set({ cardLast4: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                placeholder="XXXX"
                className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10"
              />
            </div>
          )}

          {v.paymentMode === 'upi' && (
            <div>
              <Label className="text-white/90 text-sm">UPI Transaction ID (Optional)</Label>
              <Input
                value={v.upiTransactionId || ''}
                onChange={(e) => set({ upiTransactionId: e.target.value })}
                placeholder="Enter transaction ID"
                className="mt-1 bg-white/15 text-white placeholder:text-white/60 border-white/20 h-10"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
