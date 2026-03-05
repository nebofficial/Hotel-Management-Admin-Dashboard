'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DailyRevenueSummary from './DailyRevenueSummary'
import CashCountVerification from './CashCountVerification'
import ShiftClosing from './ShiftClosing'
import CashDifferenceReport from './CashDifferenceReport'
import ManagerApproval from './ManagerApproval'
import SystemLock from './SystemLock'
import ShiftWiseSummary from './ShiftWiseSummary'
import AutoGenerateClosingReport from './AutoGenerateClosingReport'

export default function DayClosing() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [overview, setOverview] = useState(null)
  const [cashState, setCashState] = useState({ systemCash: 0, physicalCash: 0, cashDifference: 0 })
  const [shifts, setShifts] = useState([])
  const [reason, setReason] = useState('')

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadOverview = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/day-closing/overview?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setOverview(data)
        setCashState(data.cash || { systemCash: 0, physicalCash: 0, cashDifference: 0 })
        setShifts(data.closing?.shifts || [])
        setReason(data.closing?.notes || '')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiBase) loadOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, date])

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Select a hotel or log in with a hotel account to view day closing.</p>
      </div>
    )
  }

  if (loading && !overview) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading day closing data...</p>
      </div>
    )
  }

  const locked = overview?.closing?.locked
  const cashDifference = cashState.cashDifference ?? cashState.physicalCash - cashState.systemCash

  const handleSave = async () => {
    if (!apiBase) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/day-closing/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          date,
          physicalCash: cashState.physicalCash,
          totalRevenue: overview?.revenue?.totalRevenue || 0,
          roomRevenue: overview?.revenue?.roomRevenue || 0,
          restaurantRevenue: overview?.revenue?.restaurantRevenue || 0,
          otherIncome: overview?.revenue?.otherIncome || 0,
          shifts,
          notes: reason,
          locked,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save day closing')
      await loadOverview()
      alert('Day closing saved.')
    } catch (e) {
      alert(e.message || 'Failed to save day closing')
    } finally {
      setSaving(false)
    }
  }

  const handleLock = async () => {
    if (!apiBase) return
    const confirmLock = window.confirm('Lock this day? This will prevent add/edit/delete for this date.')
    if (!confirmLock) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/day-closing/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to lock day')
      await loadOverview()
      alert('Day locked successfully.')
    } catch (e) {
      alert(e.message || 'Failed to lock day')
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-amber-50/20 to-emerald-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Day Closing</h1>
          <p className="text-gray-600 mt-1">Daily settlement, cash verification, and system lock</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || locked}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Day Closing'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DailyRevenueSummary revenue={overview?.revenue} />
        <CashCountVerification
          cash={cashState}
          locked={locked}
          onChange={(patch) =>
            setCashState((prev) => {
              const next = { ...prev, ...patch }
              return {
                ...next,
                cashDifference:
                  next.cashDifference ?? next.physicalCash - next.systemCash,
              }
            })
          }
        />
        <ShiftClosing shifts={shifts} onChange={setShifts} locked={locked} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CashDifferenceReport
          cashDifference={cashDifference}
          reason={reason}
          onChange={setReason}
          locked={locked}
        />
        <ManagerApproval closing={overview?.closing} locked={locked} />
        <SystemLock locked={locked} onLock={handleLock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShiftWiseSummary shifts={shifts} />
        <AutoGenerateClosingReport date={date} overview={overview} />
      </div>
    </div>
  )
}

