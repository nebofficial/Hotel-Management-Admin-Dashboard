'use client'

import { useState } from 'react'
import { useAuth } from '@/app/auth-context'

import ReservationSearchPanel from './ReservationSearchPanel'
import CancellationPolicyPanel from './CancellationPolicyPanel'
import CancellationFeeCalculator from './CancellationFeeCalculator'
import RefundProcessingPanel from './RefundProcessingPanel'
import NoShowMarker from './NoShowMarker'
import CancellationReasonForm from './CancellationReasonForm'
import ConfirmationPreview from './ConfirmationPreview'
import CancellationActions from './CancellationActions'

import { getAllReservations } from '@/services/api/reservationApi'
import {
  calculateCancellationFee,
  cancelReservation as cancelReservationApi,
  processRefund as processRefundApi,
  markNoShow as markNoShowApi,
} from '@/services/api/cancellationApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CancellationPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${API_BASE_URL}/api/hotel-data/${effectiveHotelId}` : ''

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])
  const [selected, setSelected] = useState(null)

  const [policy, setPolicy] = useState(null)
  const [refundForm, setRefundForm] = useState({})
  const [processingRefund, setProcessingRefund] = useState(false)
  const [noShowForm, setNoShowForm] = useState({})
  const [processingNoShow, setProcessingNoShow] = useState(false)
  const [reasonForm, setReasonForm] = useState({})
  const [cancelling, setCancelling] = useState(false)

  const handleSearch = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await getAllReservations(apiBase, { search })
      setReservations(data.reservations || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = async (r) => {
    setSelected(r)
    setPolicy(null)
    setRefundForm({})
    setReasonForm({})
    try {
      const res = await calculateCancellationFee(apiBase, { bookingId: r.id, asOf: new Date().toISOString() })
      setPolicy(res)
      setRefundForm((prev) => ({ ...prev, amount: res.refundableAmount, method: 'original' }))
    } catch (e) {
      console.error(e)
    }
  }

  const handleProcessRefund = async (form) => {
    if (!apiBase || !selected || !policy) return
    setProcessingRefund(true)
    try {
      await processRefundApi(apiBase, {
        bookingId: selected.id,
        amount: form.amount ?? policy.refundableAmount,
        method: form.method || 'original',
        reference: form.reference || '',
      })
      alert('Refund processed.')
    } catch (e) {
      alert(e.message || 'Failed to process refund')
    } finally {
      setProcessingRefund(false)
    }
  }

  const handleNoShow = async (form) => {
    if (!apiBase || !selected) return
    setProcessingNoShow(true)
    try {
      await markNoShowApi(apiBase, { bookingId: selected.id, reason: form.reason || 'No-show' })
      alert('Reservation marked as no-show.')
    } catch (e) {
      alert(e.message || 'Failed to mark no-show')
    } finally {
      setProcessingNoShow(false)
    }
  }

  const handleConfirmCancellation = async () => {
    if (!apiBase || !selected || !reasonForm.details) return
    setCancelling(true)
    try {
      const res = await cancelReservationApi(apiBase, {
        bookingId: selected.id,
        reason: `${reasonForm.category || 'Other'}: ${reasonForm.details}`,
        asOf: new Date().toISOString(),
        refundMethod: refundForm.method || 'original',
        refundReference: refundForm.reference || '',
      })
      setPolicy(res.policy)
      alert('Reservation cancelled.')
    } catch (e) {
      alert(e.message || 'Failed to cancel reservation')
    } finally {
      setCancelling(false)
    }
  }

  const canCancel = !!selected && !!reasonForm.details

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in to manage cancellations.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-red-50/10 to-violet-50/20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cancellations & No-Show</h1>
        <p className="text-gray-600 mt-1">
          Control cancellation fees, refunds, no-shows, and confirmation messages in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 space-y-4">
          <ReservationSearchPanel
            search={search}
            onSearchChange={setSearch}
            onSubmit={handleSearch}
            reservations={reservations}
            selected={selected}
            onSelect={handleSelect}
            loading={loading}
          />

          <CancellationPolicyPanel policy={policy} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CancellationFeeCalculator policy={policy} />
            <RefundProcessingPanel
              policy={policy}
              value={refundForm}
              onChange={setRefundForm}
              onProcess={handleProcessRefund}
              processing={processingRefund}
            />
          </div>

          <NoShowMarker
            value={noShowForm}
            onChange={setNoShowForm}
            onMark={handleNoShow}
            processing={processingNoShow}
          />
        </div>

        <div className="xl:col-span-5 space-y-4">
          <CancellationReasonForm value={reasonForm} onChange={setReasonForm} />
          <ConfirmationPreview booking={selected} policy={policy} />
          <CancellationActions canCancel={canCancel} cancelling={cancelling} onCancel={handleConfirmCancellation} />
        </div>
      </div>
    </div>
  )
}

