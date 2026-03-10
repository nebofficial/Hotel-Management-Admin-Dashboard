'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import {
  fetchPromoCodes,
  createPromoCode,
  updatePromoCode,
  togglePromoStatus,
  fetchPromoAnalytics,
} from '@/services/api/promoCodesApi'
import { PromoCodesHeader } from './PromoCodesHeader'
import { PromoCodeFilters } from './PromoCodeFilters'
import { PromoCodesTable } from './PromoCodesTable'
import { CreatePromoCodeModal } from './CreatePromoCodeModal'
import { EditPromoCodeModal } from './EditPromoCodeModal'
import { PromoUsageAnalytics } from './PromoUsageAnalytics'
import { PromoTrackingPanel } from './PromoTrackingPanel'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function PromoCodesDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [filters, setFilters] = useState({ code: '', status: '' })
  const [promos, setPromos] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [activePromo, setActivePromo] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const loadPromos = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const data = await fetchPromoCodes(apiBase)
      setPromos(data?.items || [])
    } catch (e) {
      console.error('Load promos error', e)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!apiBase) return
    try {
      const data = await fetchPromoAnalytics(apiBase)
      setAnalytics(data)
    } catch (e) {
      console.error('Load analytics error', e)
    }
  }

  useEffect(() => {
    loadPromos()
    loadAnalytics()
  }, [apiBase])

  const filteredPromos = useMemo(() => {
    let list = promos || []
    if (filters.code) {
      const term = filters.code.toLowerCase()
      list = list.filter((p) => String(p.code || '').toLowerCase().includes(term))
    }
    if (filters.status === 'true') list = list.filter((p) => !!p.isActive)
    if (filters.status === 'false') list = list.filter((p) => !p.isActive)
    return list
  }, [promos, filters.code, filters.status])

  const handleCreate = async (payload) => {
    const res = await createPromoCode(apiBase, payload)
    const created = res?.promo
    if (created) {
      setPromos((prev) => [created, ...prev])
      setFilters({ code: '', status: '' })
    }
    loadAnalytics()
  }

  const handleUpdate = async (id, payload) => {
    const res = await updatePromoCode(apiBase, id, payload)
    const updated = res?.promo
    if (updated) {
      setPromos((prev) => prev.map((p) => (p.id === id ? updated : p)))
      setActivePromo(null)
      setEditOpen(false)
    }
    loadAnalytics()
  }

  const handleToggleStatus = async (p) => {
    const res = await togglePromoStatus(apiBase, p.id)
    const updated = res?.promo
    if (updated) {
      setPromos((prev) => prev.map((promo) => (promo.id === p.id ? updated : promo)))
    }
    loadAnalytics()
  }

  const handleEdit = (p) => {
    setActivePromo(p)
    setEditOpen(true)
  }

  return (
    <div className="space-y-6 pb-8">
      <PromoCodesHeader onNewPromo={() => setCreateOpen(true)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-500 p-4 text-white shadow-lg">
          <p className="text-[11px] opacity-90 uppercase tracking-wide">Active Promo Codes</p>
          <p className="text-2xl font-bold">{analytics?.activePromoCodes ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-4 text-white shadow-lg">
          <p className="text-[11px] opacity-90 uppercase tracking-wide">Total Discount Given</p>
          <p className="text-2xl font-bold">₹ {Number(analytics?.totalDiscountGiven ?? 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-4 text-white shadow-lg">
          <p className="text-[11px] opacity-90 uppercase tracking-wide">Total Promo Bookings</p>
          <p className="text-2xl font-bold">{analytics?.totalPromoBookings ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-lime-500 to-green-500 p-4 text-white shadow-lg">
          <p className="text-[11px] opacity-90 uppercase tracking-wide">Average Discount Value</p>
          <p className="text-2xl font-bold">₹ {Number(analytics?.averageDiscountValue ?? 0).toLocaleString('en-IN')}</p>
        </div>
      </div>
      <PromoCodeFilters
        code={filters.code}
        status={filters.status}
        onChangeCode={(v) => setFilters((f) => ({ ...f, code: v }))}
        onChangeStatus={(v) => setFilters((f) => ({ ...f, status: v }))}
        onReset={() => setFilters({ code: '', status: '' })}
      />
      <PromoCodesTable
        promos={filteredPromos}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromoUsageAnalytics analytics={analytics} />
        <PromoTrackingPanel analytics={analytics} />
      </div>
      <CreatePromoCodeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />
      <EditPromoCodeModal
        open={editOpen}
        promo={activePromo}
        onClose={() => { setEditOpen(false); setActivePromo(null) }}
        onSave={handleUpdate}
      />
    </div>
  )
}
