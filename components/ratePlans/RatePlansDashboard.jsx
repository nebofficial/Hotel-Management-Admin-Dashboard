'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { RatePlansHeader } from './RatePlansHeader'
import { RatePlanFilters } from './RatePlanFilters'
import { RatePlansTable } from './RatePlansTable'
import { CreateRatePlanModal } from './CreateRatePlanModal'
import { EditRatePlanModal } from './EditRatePlanModal'
import { AssignRoomTypeModal } from './AssignRoomTypeModal'
import { RatePlanComparison } from './RatePlanComparison'
import { ExportRatePlanButton } from './ExportRatePlanButton'
import {
  fetchRatePlans,
  createRatePlan,
  updateRatePlan,
  assignRatePlanToRoomType,
  toggleRatePlanStatus,
  exportRatePlans,
} from '@/services/api/ratePlansApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function RatePlansDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [filters, setFilters] = useState({ name: '', roomType: '', status: '' })
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [activePlan, setActivePlan] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      // Always fetch full list from backend, then apply all filters on the client
      const data = await fetchRatePlans(apiBase)
      let items = data?.items || []

      if (filters.name) {
        const term = filters.name.toLowerCase()
        items = items.filter((p) => String(p.name || '').toLowerCase().includes(term))
      }

      if (filters.status) {
        const status = filters.status.toLowerCase()
        items = items.filter((p) => String(p.status || '').toLowerCase() === status)
      }

      if (filters.roomType) {
        const term = filters.roomType.toLowerCase()
        items = items.filter((p) =>
          (p.roomTypes || []).some((rt) => String(rt).toLowerCase().includes(term)),
        )
      }

      setPlans(items)
    } catch (err) {
      console.error('Rate plans load error', err)
      setError(err?.message || 'Failed to load rate plans')
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, filters.name, filters.status, filters.roomType])

  const handleCreate = async (payload) => {
    try {
      const res = await createRatePlan(apiBase, payload)
      const created = res?.plan || res

      // Clear filters so the new plan is not hidden by previous search criteria.
      setFilters({ name: '', roomType: '', status: '' })

      // Optimistically add the new plan to the local list so it appears immediately.
      if (created && created.id) {
        setPlans((prev) => [created, ...prev])
      } else {
        // Fallback: reload from server if response shape is unexpected.
        await load()
      }
    } catch (err) {
      console.error('Create rate plan error', err)
      setError(err?.message || 'Failed to create rate plan')
      throw err
    }
  }

  const handleUpdate = async (id, payload) => {
    try {
      await updateRatePlan(apiBase, id, payload)
      await load()
    } catch (err) {
      console.error('Update rate plan error', err)
      setError(err?.message || 'Failed to update rate plan')
      throw err
    }
  }

  const handleAssign = async (id, roomTypesText) => {
    const roomTypes = roomTypesText
      .split(',')
      .map((rt) => rt.trim())
      .filter(Boolean)
    try {
      await assignRatePlanToRoomType(apiBase, id, roomTypes)
      await load()
    } catch (err) {
      console.error('Assign room types error', err)
      setError(err?.message || 'Failed to assign room types')
      throw err
    }
  }

  const handleToggleStatus = async (plan) => {
    try {
      await toggleRatePlanStatus(apiBase, plan.id)
      await load()
    } catch (err) {
      console.error('Toggle rate plan status error', err)
      setError(err?.message || 'Failed to update rate plan status')
      throw err
    }
  }

  const handleExport = async () => {
    try {
      const data = await exportRatePlans(apiBase, {
        name: filters.name || undefined,
        status: filters.status || undefined,
      })
      setPlans(data.items || [])
    } catch (err) {
      console.error('Export rate plans error', err)
    }
  }

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to manage rate plans.</p>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-slate-900/5">
      <RatePlansHeader
        onCreate={() => setCreateOpen(true)}
        onExport={handleExport}
      />

      <RatePlanFilters
        name={filters.name}
        roomType={filters.roomType}
        status={filters.status}
        onChangeName={(name) => setFilters((prev) => ({ ...prev, name }))}
        onChangeRoomType={(roomType) => setFilters((prev) => ({ ...prev, roomType }))}
        onChangeStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
        onReset={() => setFilters({ name: '', roomType: '', status: '' })}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <RatePlansTable
        plans={plans}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelected}
        onEdit={(plan) => {
          setActivePlan(plan)
          setEditOpen(true)
        }}
        onAssign={(plan) => {
          setActivePlan(plan)
          setAssignOpen(true)
        }}
        onToggleStatus={handleToggleStatus}
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          Showing {plans.length} rate plans. Select multiple plans to compare.
        </p>
        <ExportRatePlanButton plans={plans} />
      </div>

      <RatePlanComparison plans={plans} selectedIds={selectedIds} />

      <CreateRatePlanModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      <EditRatePlanModal
        open={editOpen}
        plan={activePlan}
        onClose={() => setEditOpen(false)}
        onSave={handleUpdate}
      />

      <AssignRoomTypeModal
        open={assignOpen}
        plan={activePlan}
        onClose={() => setAssignOpen(false)}
        onSave={handleAssign}
      />
    </main>
  )
}

