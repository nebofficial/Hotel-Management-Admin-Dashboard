'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/app/auth-context'
import { downloadStatement } from '@/services/api/corporateBillingApi'

export function CorporateStatement({ accounts }) {
  const [accountId, setAccountId] = useState('')
  const [statement, setStatement] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { hotel } = useAuth()

  const handleLoad = async () => {
    if (!hotel?.id) {
      toast({ variant: 'destructive', title: 'Hotel not selected' })
      return
    }
    if (!accountId) {
      toast({ variant: 'destructive', title: 'Select a corporate account' })
      return
    }
    try {
      setLoading(true)
      const res = await downloadStatement(hotel.id, accountId)
      setStatement(res.statement)
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to load statement', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const totals = statement?.totals || {}

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-800">Corporate Statement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {(accounts || []).map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.companyName} ({a.accountNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleLoad} disabled={loading}>
            {loading ? 'Loading...' : 'View Statement'}
          </Button>
        </div>

        {statement && (
          <div className="mt-2 rounded-md border border-slate-100 bg-slate-50 p-3 text-xs space-y-1">
            <div className="font-semibold text-slate-700">
              {statement.account?.companyName} ({statement.account?.accountNumber})
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>Total Invoiced: {totals.totalInvoiced}</div>
              <div>Total Paid: {totals.totalPaid}</div>
              <div>Outstanding: {totals.outstanding}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

