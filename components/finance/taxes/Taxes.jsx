'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2 } from 'lucide-react'
import TaxConfiguration from './TaxConfiguration'
import GSTCalculation from './GSTCalculation'
import TaxSummaryReport from './TaxSummaryReport'

export default function Taxes() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [settings, setSettings] = useState(null)
  const [summary, setSummary] = useState(null)
  const [saving, setSaving] = useState(false)

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadSettings = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/taxes/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) setSettings(data.settings || null)
  }

  const loadSummary = async () => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/taxes/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) setSummary(data || null)
  }

  useEffect(() => {
    loadSettings()
    loadSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const handleSaveSettings = async () => {
    if (!apiBase || !settings) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/taxes/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(settings),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to save tax settings')
      setSettings(data.settings || settings)
      alert('Tax settings saved.')
    } catch (e) {
      alert(e.message || 'Failed to save tax settings')
    } finally {
      setSaving(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">
          Select a hotel or log in with a hotel account to manage taxes.
        </p>
      </div>
    )
  }

  if (!settings && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading tax configuration…</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-green-50/20 to-sky-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Taxes & Charges</h1>
          <p className="text-gray-600 mt-1">
            Configure GST, service charges, and view tax summary.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
        >
          {saving ? 'Saving…' : 'Save Tax Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaxConfiguration settings={settings} onChange={setSettings} />
        <GSTCalculation defaultRate={settings?.defaultGstRate} />
        <TaxSummaryReport summary={summary} />
      </div>
    </div>
  )
}

