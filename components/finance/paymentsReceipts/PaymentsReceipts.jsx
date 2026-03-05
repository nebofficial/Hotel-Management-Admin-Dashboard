'use client'

import { useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RecordPayment from './RecordPayment'
import RecordReceipt from './RecordReceipt'
import AllocatePayment from './AllocatePayment'
import PaymentModeTracking from './PaymentModeTracking'
import ReceiptPrint from './ReceiptPrint'

export default function PaymentsReceipts() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [lastReceipt, setLastReceipt] = useState(null)
  const [lastPayment, setLastPayment] = useState(null)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage payments and receipts.
        </p>
      </div>
    )
  }

  if (!apiBase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading payments & receipts...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-sky-50/20 to-emerald-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Receipts</h1>
          <p className="text-gray-600 mt-1">
            Record outgoing payments, incoming receipts, and track payment modes.
          </p>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="bg-white shadow-sm rounded-full px-1 py-1">
          <TabsTrigger value="record" className="px-4 py-1 text-sm rounded-full">
            Record Payment / Receipt
          </TabsTrigger>
          <TabsTrigger value="allocate" className="px-4 py-1 text-sm rounded-full">
            Allocate & Balances
          </TabsTrigger>
          <TabsTrigger value="modes" className="px-4 py-1 text-sm rounded-full">
            Modes & Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecordPayment
              apiBase={apiBase}
              onRecorded={(p) => setLastPayment(p)}
            />
            <RecordReceipt
              apiBase={apiBase}
              onRecorded={(r) => setLastReceipt(r)}
            />
            <ReceiptPrint lastReceipt={lastReceipt || lastPayment} />
          </div>
        </TabsContent>

        <TabsContent value="allocate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocatePayment apiBase={apiBase} />
          </div>
        </TabsContent>

        <TabsContent value="modes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentModeTracking apiBase={apiBase} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

