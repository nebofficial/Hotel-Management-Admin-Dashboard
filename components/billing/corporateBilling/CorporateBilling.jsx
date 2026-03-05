'use client'

import { useEffect, useMemo, useState } from 'react'
import { CorporateBillingStats } from './CorporateBillingStats'
import { CorporateAccountForm } from './CorporateAccountForm'
import { CorporateInvoiceGenerator } from './CorporateInvoiceGenerator'
import { BulkInvoiceGenerator } from './BulkInvoiceGenerator'
import { OutstandingTracker } from './OutstandingTracker'
import { CorporateStatement } from './CorporateStatement'
import { CorporateInvoicePreview } from './CorporateInvoicePreview'
import { fetchCorporateAccounts, fetchOutstandingPayments } from '@/services/api/corporateBillingApi'
import { useAuth } from '@/app/auth-context'

export default function CorporateBilling() {
  const { hotel } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [outstanding, setOutstanding] = useState([])
  const [lastInvoice, setLastInvoice] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!hotel?.id) return
      try {
        const [accRes, outRes] = await Promise.all([
          fetchCorporateAccounts(hotel.id),
          fetchOutstandingPayments(hotel.id),
        ])
        setAccounts(accRes.accounts || [])
        setOutstanding(outRes.companies || [])
      } catch {
        // ignore initial load errors
      }
    }
    load()
  }, [hotel?.id])

  const stats = useMemo(() => {
    const totalClients = accounts.length
    const outstandingTotal = outstanding.reduce((s, c) => s + Number(c.outstanding || 0), 0)
    const totalLimit = accounts.reduce((s, a) => s + Number(a.creditLimit || 0), 0)
    const utilization = totalLimit > 0 ? (outstandingTotal / totalLimit) * 100 : 0
    // For now, use total invoiced as monthly revenue placeholder
    const monthlyRevenue = accounts.reduce((s, a) => s + Number(a.totalInvoiced || 0), 0)
    return {
      totalClients,
      monthlyRevenue,
      outstanding: outstandingTotal,
      utilization,
    }
  }, [accounts, outstanding])

  const handleAccountCreated = (acc) => {
    setAccounts((prev) => [...prev, acc])
  }

  const handleInvoiceGenerated = (inv) => {
    setLastInvoice(inv)
  }

  return (
    <div className="space-y-6">
      <CorporateBillingStats summary={stats} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
        <div className="space-y-4">
          <CorporateAccountForm onCreated={handleAccountCreated} />
          <CorporateInvoiceGenerator accounts={accounts} onGenerated={handleInvoiceGenerated} />
          <BulkInvoiceGenerator />
        </div>
        <div className="space-y-4">
          <OutstandingTracker companies={outstanding} />
          <CorporateStatement accounts={accounts} />
          <CorporateInvoicePreview invoice={lastInvoice} />
        </div>
      </div>
    </div>
  )
}

