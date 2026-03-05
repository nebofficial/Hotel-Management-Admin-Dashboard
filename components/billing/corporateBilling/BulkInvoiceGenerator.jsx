'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/app/auth-context'
import { generateBulkInvoices } from '@/services/api/corporateBillingApi'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function BulkInvoiceGenerator() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { hotel } = useAuth()

  const handleGenerate = async () => {
    if (!hotel?.id) {
      toast({ variant: 'destructive', title: 'Hotel not selected' })
      return
    }
    try {
      setLoading(true)
      const res = await generateBulkInvoices(hotel.id, { month, year })
      toast({
        title: 'Bulk invoices generated',
        description: `${res.invoices?.length || 0} invoices created for ${MONTHS[month - 1]} ${year}`,
      })
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to generate bulk invoices', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-sky-50 border-indigo-100">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-indigo-700">Monthly Consolidated Invoice</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Month</Label>
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, idx) => (
                <SelectItem key={m} value={String(idx + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Year</Label>
          <input
            className="flex h-9 w-24 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value || now.getFullYear()))}
          />
        </div>
        <div className="ml-auto">
          <Button type="button" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Monthly Invoices'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

