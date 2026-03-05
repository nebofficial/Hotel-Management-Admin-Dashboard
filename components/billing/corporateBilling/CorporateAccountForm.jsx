'use client'

import { useState } from 'react'
import { CompanyDetailsPanel } from './CompanyDetailsPanel'
import { GSTCompanyDetails } from './GSTCompanyDetails'
import { CreditLimitSetup } from './CreditLimitSetup'
import { CreditPeriodSetup } from './CreditPeriodSetup'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createCorporateAccount } from '@/services/api/corporateBillingApi'
import { useAuth } from '@/app/auth-context'

export function CorporateAccountForm({ onCreated }) {
  const [company, setCompany] = useState({})
  const [tax, setTax] = useState({})
  const [creditLimit, setCreditLimit] = useState(500000)
  const [creditPeriod, setCreditPeriod] = useState(30)
  const [loading, setLoading] = useState(false)
  const { hotel } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!hotel?.id) {
      toast({ variant: 'destructive', title: 'Hotel not selected' })
      return
    }
    if (!company.companyName) {
      toast({ variant: 'destructive', title: 'Company name is required' })
      return
    }
    try {
      setLoading(true)
      const payload = {
        ...company,
        ...tax,
        creditLimit,
        creditPeriodDays: creditPeriod,
      }
      const res = await createCorporateAccount(hotel.id, payload)
      toast({ title: 'Corporate account created', description: res.account?.accountNumber })
      onCreated?.(res.account)
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to create account', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <CompanyDetailsPanel value={company} onChange={setCompany} />
        <GSTCompanyDetails value={tax} onChange={setTax} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CreditLimitSetup creditLimit={creditLimit} onChange={setCreditLimit} />
        <CreditPeriodSetup value={creditPeriod} onChange={setCreditPeriod} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Corporate Account'}
        </Button>
      </div>
    </form>
  )
}

