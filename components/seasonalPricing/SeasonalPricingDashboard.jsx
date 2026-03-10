'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { SeasonalPricingHeader } from './SeasonalPricingHeader'
import { SeasonalFilters } from './SeasonalFilters'
import { SeasonalPricingTable } from './SeasonalPricingTable'
import { CreateSeasonRuleModal } from './CreateSeasonRuleModal'
import { EditSeasonRuleModal } from './EditSeasonRuleModal'
import { WeekendPricingRules } from './WeekendPricingRules'
import { HolidayPricingPanel } from './HolidayPricingPanel'
import { AssignRoomTypesPanel } from './AssignRoomTypesPanel'
import { SeasonalCalendarView } from './SeasonalCalendarView'
import {
  fetchSeasonalRules,
  createSeasonRule,
  updateSeasonRule,
  deleteSeasonRule,
} from '@/services/api/seasonalPricingApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function SeasonalPricingDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [filters, setFilters] = useState({
    name: '',
    roomType: '',
    ruleType: '',
    status: '',
    fromDate: '',
    toDate: '',
  })
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [activeRule, setActiveRule] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSeasonalRules(apiBase)
      let items = data?.items || []

      if (filters.name) {
        const term = filters.name.toLowerCase()
        items = items.filter((r) => String(r.name || '').toLowerCase().includes(term))
      }
      if (filters.roomType) {
        const term = filters.roomType.toLowerCase()
        items = items.filter((r) =>
          (r.roomTypes || []).some((rt) => String(rt).toLowerCase().includes(term)),
        )
      }
      if (filters.ruleType) {
        const type = filters.ruleType.toLowerCase()
        items = items.filter((r) => String(r.ruleType || '').toLowerCase() === type)
      }
      if (filters.status) {
        const active = filters.status.toLowerCase() === 'active'
        items = items.filter((r) => !!r.isActive === active)
      }
      if (filters.fromDate) {
        const from = new Date(filters.fromDate)
        items = items.filter((r) => new Date(r.endDate) >= from)
      }
      if (filters.toDate) {
        const to = new Date(filters.toDate)
        items = items.filter((r) => new Date(r.startDate) <= to)
      }

      setRules(items)
    } catch (err) {
      console.error('Seasonal pricing load error', err)
      setError(err?.message || 'Failed to load seasonal pricing rules')
      setRules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, filters.name, filters.roomType, filters.ruleType, filters.status, filters.fromDate, filters.toDate])

  const handleCreate = async (payload) => {
    const res = await createSeasonRule(apiBase, payload)
    const created = res?.rule || res
    setFilters((prev) => ({ ...prev, name: '', roomType: '', ruleType: '', status: '' }))
    if (created && created.id) {
      setRules((prev) => [created, ...prev])
    } else {
      await load()
    }
  }

  const handleUpdate = async (id, payload) => {
    const res = await updateSeasonRule(apiBase, id, payload)
    const updated = res?.rule || res
    if (updated && updated.id) {
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
      setActiveRule(updated)
    } else {
      await load()
    }
  }

  const handleDelete = async (rule) => {
    if (!rule) return
    if (!window.confirm(`Delete seasonal rule "${rule.name}"?`)) return
    await deleteSeasonRule(apiBase, rule.id)
    setRules((prev) => prev.filter((r) => r.id !== rule.id))
    if (activeRule?.id === rule.id) setActiveRule(null)
  }

  const overview = useMemo(() => {
    const activeRules = rules.filter((r) => r.isActive)
    const today = new Date()
    const upcoming = activeRules.filter((r) => new Date(r.startDate) > today)
    const holiday = activeRules.filter((r) => r.ruleType === 'holiday')
    const weekend = activeRules.filter((r) => r.ruleType === 'weekend')
    return {
      activeCount: activeRules.length,
      upcomingCount: upcoming.length,
      holidayCount: holiday.length,
      weekendCount: weekend.length,
    }
  }, [rules])

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to manage seasonal pricing.</p>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-900/5">
      <SeasonalPricingHeader onCreate={() => setCreateOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 text-white shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Active Seasonal Rules</p>
          <p className="text-2xl font-semibold mt-1">{overview.activeCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400 text-slate-900 shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Upcoming Seasonal Events</p>
          <p className="text-2xl font-semibold mt-1">{overview.upcomingCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-300 to-orange-300 text-slate-900 shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Holiday Pricing Rules</p>
          <p className="text-2xl font-semibold mt-1">{overview.holidayCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-red-400 to-rose-500 text-white shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Weekend Pricing Rules</p>
          <p className="text-2xl font-semibold mt-1">{overview.weekendCount}</p>
        </div>
      </div>

      <SeasonalFilters
        name={filters.name}
        roomType={filters.roomType}
        ruleType={filters.ruleType}
        status={filters.status}
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onChangeName={(name) => setFilters((prev) => ({ ...prev, name }))}
        onChangeRoomType={(roomType) => setFilters((prev) => ({ ...prev, roomType }))}
        onChangeRuleType={(ruleType) => setFilters((prev) => ({ ...prev, ruleType }))}
        onChangeStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
        onChangeFromDate={(fromDate) => setFilters((prev) => ({ ...prev, fromDate }))}
        onChangeToDate={(toDate) => setFilters((prev) => ({ ...prev, toDate }))}
        onReset={() =>
          setFilters({ name: '', roomType: '', ruleType: '', status: '', fromDate: '', toDate: '' })
        }
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <SeasonalPricingTable
        rules={rules}
        onEdit={(rule) => {
          setActiveRule(rule)
          setEditOpen(true)
        }}
        onDelete={handleDelete}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SeasonalCalendarView rules={rules} />
        </div>
        <div className="space-y-4">
          <WeekendPricingRules rules={rules} />
          <HolidayPricingPanel rules={rules} />
        </div>
      </div>

      <AssignRoomTypesPanel
        activeRule={activeRule}
        onEditRule={() => {
          if (!activeRule) return
          setEditOpen(true)
        }}
      />

      <CreateSeasonRuleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      <EditSeasonRuleModal
        open={editOpen}
        rule={activeRule}
        onClose={() => setEditOpen(false)}
        onSave={handleUpdate}
      />
    </main>
  )
}

