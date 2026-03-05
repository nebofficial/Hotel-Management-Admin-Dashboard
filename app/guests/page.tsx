"use client"

import { useEffect, useMemo, useState } from "react"
import { Users, Star, Crown, AlertTriangle } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { DashboardOverview } from "@/components/dashboard-overview"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface GuestStats {
  totalGuests: number
  vipGuests: number
  loyaltyMembers: number
  openComplaints: number
}

export default function GuestsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<GuestStats>({
    totalGuests: 0,
    vipGuests: 0,
    loyaltyMembers: 0,
    openComplaints: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      setStats({ totalGuests: 0, vipGuests: 0, loyaltyMembers: 0, openComplaints: 0 })
      return
    }

    let cancelled = false

    const loadStats = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        if (!cancelled) {
          setLoading(false)
          setError("Not authenticated. Please log in again.")
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const guestsReq = fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/guests`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(async (r) => {
          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            console.warn("Guests API error", data)
            // Soft-fail: treat as no guests instead of breaking the whole page
            return { guests: [] }
          }
          return r.json()
        })

        const loyaltyReq = fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/loyalty`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(async (r) => {
          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            console.warn("Loyalty API error", data)
            // Soft-fail: treat as no loyalty members instead of breaking the whole page
            return { members: [] }
          }
          return r.json()
        })

        const statsReq = fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/feedback/dashboard-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(async (r) => {
          if (!r.ok) {
            const data = await r.json().catch(() => ({}))
            console.warn("Feedback stats API error", data)
            // Soft-fail: treat as zero open complaints
            return { openComplaints: 0 }
          }
          return r.json()
        })

        const [guestsData, loyaltyData, feedbackStats] = await Promise.all([
          guestsReq,
          loyaltyReq,
          statsReq,
        ])

        if (cancelled) return

        const guests = guestsData.guests || []
        const loyaltyMembers = (loyaltyData.members || []).length

        const vipGuests = guests.filter((g: any) => {
          const prefs = g.preferences || {}
          const raw = String(prefs.vipStatus || "").toUpperCase()
          return raw === "VIP"
        }).length

        const next: GuestStats = {
          totalGuests: guests.length,
          vipGuests,
          loyaltyMembers,
          openComplaints: Number(feedbackStats.openComplaints || 0),
        }

        setStats(next)
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Failed to load guest dashboard statistics."
          )
          setStats({ totalGuests: 0, vipGuests: 0, loyaltyMembers: 0, openComplaints: 0 })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 15000) // refresh every 15s for near real-time

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user?.hotelId])

  const metrics = useMemo(
    () => [
      {
        label: "Total Guests",
        value: stats.totalGuests,
        change: undefined,
        trend: "up" as const,
        icon: Users,
        gradient: "from-emerald-500 via-emerald-400 to-teal-500",
      },
      {
        label: "VIP Guests",
        value: stats.vipGuests,
        change: undefined,
        trend: "up" as const,
        icon: Crown,
        gradient: "from-amber-500 via-amber-400 to-orange-500",
      },
      {
        label: "Loyalty Members",
        value: stats.loyaltyMembers,
        change: undefined,
        trend: "up" as const,
        icon: Star,
        gradient: "from-sky-500 via-sky-400 to-cyan-500",
      },
      {
        label: "Open Complaints",
        value: stats.openComplaints,
        change: undefined,
        trend: stats.openComplaints > 0 ? ("down" as const) : ("up" as const),
        icon: AlertTriangle,
        gradient: "from-rose-500 via-rose-400 to-orange-500",
      },
    ],
    [stats]
  )

  const chartData = useMemo(
    () => [
      { name: "Guests", value: stats.totalGuests },
      { name: "VIP", value: stats.vipGuests },
      { name: "Loyalty", value: stats.loyaltyMembers },
      { name: "Open complaints", value: stats.openComplaints },
    ],
    [stats]
  )

  return (
    <main className="p-4 space-y-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Guests dashboard</h1>
          <p className="text-xs text-gray-500">
            Live overview of guest profiles, VIPs, loyalty members, and feedback.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] border-emerald-300 text-emerald-700 bg-emerald-50/70">
          Live data • auto-refresh
        </Badge>
      </div>

      {/* Colorful metric strip above generic dashboard overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-md border border-transparent bg-linear-to-br ${metric.gradient} text-white shadow-md`}
            >
              <div className="absolute inset-0 bg-white/5" />
              <div className="relative px-3 py-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wide opacity-85">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-semibold leading-tight">
                    {loading ? "…" : metric.value}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Icon className="w-5 h-5 opacity-90" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <DashboardOverview
        title="Guests"
        description="Manage guest profiles, preferences, loyalty programs, and feedback"
        metrics={metrics.map(({ label, value }) => ({
          label,
          value: loading ? "…" : value,
        }))}
        chartData={chartData}
        chartType="pie"
      />
    </main>
  )
}

