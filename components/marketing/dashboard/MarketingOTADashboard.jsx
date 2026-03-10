'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { MarketingHeader } from './MarketingHeader'
import { MarketingStatsCards } from './MarketingStatsCards'
import { MarketingFilters } from './MarketingFilters'
import { RoomPricingOverview } from './RoomPricingOverview'
import { BookingPerformanceAnalytics } from './BookingPerformanceAnalytics'
import { PromotionalCampaignSummary } from './PromotionalCampaignSummary'
import { OTABookingInsights } from './OTABookingInsights'
import { RatePlanPerformance } from './RatePlanPerformance'
import { RevenueByRoomCategory } from './RevenueByRoomCategory'
import { RecentMarketingActivity } from './RecentMarketingActivity'
import { RoomPricingChart } from './RoomPricingChart'
import {
  fetchRoomPricingOverview,
  fetchBookingPerformance,
  fetchCampaignSummary,
  fetchOTABookingInsights,
  fetchRatePlanPerformance,
  fetchRevenueByRoomCategory,
  fetchRecentMarketingActivities,
} from '@/services/api/marketingDashboardApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 29)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export default function MarketingOTADashboard() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [{ startDate, endDate }, setRange] = useState(getDefaultRange)
  const [otaChannel, setOtaChannel] = useState('')
  const [roomCategory, setRoomCategory] = useState('')
  const [ratePlan, setRatePlan] = useState('')

  const [summary, setSummary] = useState(null)
  const [dailyTrend, setDailyTrend] = useState([])
  const [roomPricing, setRoomPricing] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [channels, setChannels] = useState([])
  const [ratePlans, setRatePlans] = useState([])
  const [revenueByRoomCategory, setRevenueByRoomCategory] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const filters = useMemo(
    () => ({
      startDate,
      endDate,
      otaChannel: otaChannel || undefined,
      roomCategory: roomCategory || undefined,
      ratePlan: ratePlan || undefined,
    }),
    [startDate, endDate, otaChannel, roomCategory, ratePlan],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    setError(null)
    try {
      const [
        roomPricingRes,
        bookingPerfRes,
        campaignRes,
        otaRes,
        ratePlanRes,
        revenueRoomCatRes,
        recentRes,
      ] = await Promise.all([
        fetchRoomPricingOverview(apiBase, filters),
        fetchBookingPerformance(apiBase, filters),
        fetchCampaignSummary(apiBase, filters),
        fetchOTABookingInsights(apiBase, filters),
        fetchRatePlanPerformance(apiBase, filters),
        fetchRevenueByRoomCategory(apiBase, filters),
        fetchRecentMarketingActivities(apiBase, filters),
      ])

      setRoomPricing(roomPricingRes?.items || [])
      setSummary(bookingPerfRes?.summary || null)
      setDailyTrend(bookingPerfRes?.dailyTrend || [])
      setCampaigns(campaignRes?.campaigns || [])
      setChannels(otaRes?.channels || [])
      setRatePlans(ratePlanRes?.ratePlans || [])
      setRevenueByRoomCategory(revenueRoomCatRes?.byRoomCategory || [])
      setRecentActivity(recentRes?.items || [])
    } catch (err) {
      console.error('Marketing dashboard load error', err)
      setError(err?.message || 'Failed to load marketing dashboard')
      setRoomPricing([])
      setSummary(null)
      setDailyTrend([])
      setCampaigns([])
      setChannels([])
      setRatePlans([])
      setRevenueByRoomCategory([])
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, startDate, endDate, otaChannel, roomCategory, ratePlan])

  const handleResetRange = () => {
    setRange(getDefaultRange())
    setOtaChannel('')
    setRoomCategory('')
    setRatePlan('')
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to view marketing dashboard.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-slate-900/5">
      <MarketingHeader onRefresh={load} loading={loading} />

      <MarketingFilters
        startDate={startDate}
        endDate={endDate}
        otaChannel={otaChannel}
        roomCategory={roomCategory}
        ratePlan={ratePlan}
        onChangeStart={(value) =>
          setRange((prev) => ({ ...prev, startDate: value || getDefaultRange().startDate }))
        }
        onChangeEnd={(value) =>
          setRange((prev) => ({ ...prev, endDate: value || getDefaultRange().endDate }))
        }
        onChangeOtaChannel={setOtaChannel}
        onChangeRoomCategory={setRoomCategory}
        onChangeRatePlan={setRatePlan}
        onReset={handleResetRange}
      />

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <MarketingStatsCards summary={summary} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <BookingPerformanceAnalytics summary={summary} dailyTrend={dailyTrend} />
          <RoomPricingOverview items={roomPricing} />
        </div>
        <div className="space-y-4">
          <OTABookingInsights channels={channels} />
          <RatePlanPerformance ratePlans={ratePlans} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueByRoomCategory data={revenueByRoomCategory} />
        </div>
        <div>
          <RoomPricingChart dailyTrend={dailyTrend} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PromotionalCampaignSummary campaigns={campaigns} />
        <RecentMarketingActivity items={recentActivity} />
      </div>
    </div>
  )
}

