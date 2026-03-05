'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/app/auth-context'
import { generateCorporateInvoice } from '@/services/api/corporateBillingApi'

export function CorporateInvoiceGenerator({ accounts, onGenerated }) {
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { hotel } = useAuth()

  const handleGenerate = async () => {
    if (!hotel?.id) {
      toast({ variant: 'destructive', title: 'Hotel not selected' })
      return
    }
    if (!accountId) {
      toast({ variant: 'destructive', title: 'Select a company' })
      return
    }
    const amt = Number(amount || 0)
    if (!amt || Number.isNaN(amt)) {
      toast({ variant: 'destructive', title: 'Enter a valid invoice amount' })
      return
    }
    try {
      setLoading(true)
      const res = await generateCorporateInvoice(hotel.id, {
        corporateAccountId: accountId,
        amount: amt,
        periodStart: periodStart || null,
        periodEnd: periodEnd || null,
      })
      toast({ title: 'Corporate invoice generated', description: res.invoice?.invoiceNumber })
      onGenerated?.(res.invoice)
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to generate invoice', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-orange-700">Company-wise Billing</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-4">
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs font-medium">Select Company</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose corporate account" />
            </SelectTrigger>
            <SelectContent>
              {(accounts || []).map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.companyName} ({a.accountNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Invoice Amount (₹)</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Period Start</Label>
          <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Period End</Label>
          <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
        </div>
        <div className="md:col-span-4 flex justify-end pt-2">
          <Button type="button" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Corporate Invoice'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

