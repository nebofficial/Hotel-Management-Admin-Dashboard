'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { CampaignHeader } from './CampaignHeader'
import { PromoCodeFilters } from './PromoCodeFilters'
import { CampaignTable } from './CampaignTable'
import { CreateEmailCampaignModal } from './CreateEmailCampaignModal'
import { CreateSMSCampaignModal } from './CreateSMSCampaignModal'
import { CampaignAnalytics } from './CampaignAnalytics'
import {
  fetchCampaigns,
  createEmailCampaign,
  createSmsCampaign,
  sendBulkCampaign,
  fetchCampaignAnalytics,
  updateCampaignStatus,
} from '@/services/api/campaignApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function CampaignDashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [filters, setFilters] = useState({ name: '', type: '', status: '' })
  const [campaigns, setCampaigns] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [emailOpen, setEmailOpen] = useState(false)
  const [smsOpen, setSmsOpen] = useState(false)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const loadCampaigns = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCampaigns(apiBase)
      let items = data?.items || []
      if (filters.name) {
        const term = filters.name.toLowerCase()
        items = items.filter((c) => String(c.name || '').toLowerCase().includes(term))
      }
      if (filters.type) {
        const t = filters.type.toLowerCase()
        items = items.filter((c) => String(c.type || '').toLowerCase() === t)
      }
      if (filters.status) {
        const s = filters.status.toLowerCase()
        items = items.filter((c) => String(c.status || '').toLowerCase() === s)
      }
      setCampaigns(items)
    } catch (err) {
      console.error('Campaigns load error', err)
      setError(err?.message || 'Failed to load campaigns')
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!apiBase) return
    try {
      const data = await fetchCampaignAnalytics(apiBase)
      setAnalytics(data)
    } catch (err) {
      console.error('Campaign analytics load error', err)
    }
  }

  useEffect(() => {
    loadCampaigns()
    loadAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, filters.name, filters.type, filters.status])

  const handleCreateEmail = async (payload) => {
    const res = await createEmailCampaign(apiBase, payload)
    const created = res?.campaign || res
    if (created && created.id) {
      setCampaigns((prev) => [created, ...prev])
    } else {
      await loadCampaigns()
    }
    await loadAnalytics()
  }

  const handleCreateSms = async (payload) => {
    const res = await createSmsCampaign(apiBase, payload)
    const created = res?.campaign || res
    if (created && created.id) {
      setCampaigns((prev) => [created, ...prev])
    } else {
      await loadCampaigns()
    }
    await loadAnalytics()
  }

  const handleSendNow = async (campaign) => {
    await sendBulkCampaign(apiBase, campaign.id)
    await loadCampaigns()
    await loadAnalytics()
  }

  const handleStop = async (campaign) => {
    await updateCampaignStatus(apiBase, campaign.id, 'stopped')
    await loadCampaigns()
    await loadAnalytics()
  }

  const overview = analytics?.totals || {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
    emailsSent: campaigns.filter((c) => c.type === 'email').reduce((s, c) => s + (c.sentCount || 0), 0),
    smsSent: campaigns.filter((c) => c.type === 'sms').reduce((s, c) => s + (c.sentCount || 0), 0),
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to manage campaigns.</p>
      </div>
    )
  }

  return (
    <main className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-900/5">
      <CampaignHeader
        onCreate={() => {
          setEmailOpen(true)
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-lime-500 text-white shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Total Campaigns</p>
          <p className="text-2xl font-semibold mt-1">{overview.totalCampaigns || 0}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-400 text-slate-900 shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Active Campaigns</p>
          <p className="text-2xl font-semibold mt-1">{overview.activeCampaigns || 0}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-sky-500 text-white shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">Emails Sent</p>
          <p className="text-2xl font-semibold mt-1">
            {(overview.emailsSent || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 via-lime-400 to-amber-400 text-slate-900 shadow-lg p-4">
          <p className="text-[11px] uppercase tracking-wide opacity-90">SMS Sent</p>
          <p className="text-2xl font-semibold mt-1">
            {(overview.smsSent || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <PromoCodeFilters
        name={filters.name}
        type={filters.type}
        status={filters.status}
        onChangeName={(name) => setFilters((prev) => ({ ...prev, name }))}
        onChangeType={(type) => setFilters((prev) => ({ ...prev, type }))}
        onChangeStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
        onReset={() => setFilters({ name: '', type: '', status: '' })}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <CampaignTable
        campaigns={campaigns}
        onEdit={(c) => {
          if (c.type === 'sms') {
            setSmsOpen(true)
          } else {
            setEmailOpen(true)
          }
        }}
        onSendNow={handleSendNow}
        onStop={handleStop}
      />

      <CampaignAnalytics analytics={analytics} />

      <CreateEmailCampaignModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        onSave={handleCreateEmail}
      />

      <CreateSMSCampaignModal
        open={smsOpen}
        onClose={() => setSmsOpen(false)}
        onSave={handleCreateSms}
      />
    </main>
  )
}

