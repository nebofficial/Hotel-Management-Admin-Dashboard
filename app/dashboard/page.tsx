"use client"

import { useEffect, useMemo, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { CalendarCheck, DoorOpen, LogOut, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface DashboardMetrics {
  newBookingsToday: number
  checkInsToday: number
  checkOutsToday: number
  totalRevenue: number
  openComplaints: number
}

interface RevenuePoint {
  date: string
  value: number
}

interface RoomAvailability {
  total: number
  occupied: number
  maintenance: number
  cleaning: number
  available: number
}

interface PlatformSlice {
  name: string
  value: number
}

const PLATFORM_COLORS = ["#22c55e", "#0ea5e9", "#a855f7"]

export default function DashboardPage() {
  const { user, hotel } = useAuth()

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    newBookingsToday: 0,
    checkInsToday: 0,
    checkOutsToday: 0,
    totalRevenue: 0,
    openComplaints: 0,
  })
  const [revenueByDay, setRevenueByDay] = useState<RevenuePoint[]>([])
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailability>({
    total: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    available: 0,
  })
  const [platforms, setPlatforms] = useState<PlatformSlice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    let cancelled = false

    const load = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setError("Not authenticated. Please log in again.")
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/dashboard`,
          {
        headers: {
          Authorization: `Bearer ${token}`,
        },
          }
        )
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.message || `Failed to load dashboard (${res.status})`)
        }
        const data = await res.json()
        if (cancelled) return
        setMetrics(data.metrics || metrics)
        setRevenueByDay(data.revenueByDay || [])
        setRoomAvailability(data.roomAvailability || roomAvailability)
        setPlatforms(data.bookingByPlatform || [])
      } catch (e) {
        console.error(e)
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load dashboard metrics."
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 20000) // refresh every 20s

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user?.hotelId])

  const occupancyPercent = useMemo(() => {
    if (!roomAvailability.total) return 0
    return Math.round((roomAvailability.occupied / roomAvailability.total) * 100)
  }, [roomAvailability])

  const statCards = [
    {
      label: "New bookings",
      value: metrics.newBookingsToday,
      icon: CalendarCheck,
      accent: "from-emerald-500 via-emerald-400 to-teal-500",
    },
    {
      label: "Check-ins",
      value: metrics.checkInsToday,
      icon: DoorOpen,
      accent: "from-sky-500 via-sky-400 to-cyan-500",
    },
    {
      label: "Check-outs",
      value: metrics.checkOutsToday,
      icon: LogOut,
      accent: "from-indigo-500 via-indigo-400 to-sky-500",
    },
    {
      label: "Total revenue",
      value: metrics.totalRevenue.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
      icon: DollarSign,
      accent: "from-amber-500 via-amber-400 to-orange-500",
    },
  ]

  return (
    <ProtectedRoute>
      <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {hotel ? `${hotel.name} overview` : "Hotel overview"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time bookings, revenue, occupancy, and operational health.
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] border-emerald-200 bg-emerald-50 text-emerald-700">
            Live synced • auto-refresh
          </Badge>
        </div>

        {error && (
          <p className="text-xs text-red-600 mb-2">
            {error}
          </p>
        )}

        {/* Top stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${card.accent} text-white shadow-md`}
              >
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide opacity-90">
                      {card.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold leading-tight">
                      {loading ? "…" : card.value}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main charts column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Revenue line chart + room availability */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                    <span>Revenue (last 7 days)</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {loading ? "Loading…" : "USD • daily totals"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-3">
                  <div className="h-[220px] px-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueByDay}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickFormatter={(v) => v.slice(5)}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          width={45}
                          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                        />
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Room availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Occupancy</p>
                    <Progress value={occupancyPercent} className="h-2 rounded-full" />
                    <p className="mt-1 text-xs text-slate-500">
                      {roomAvailability.total
                        ? `${roomAvailability.occupied}/${roomAvailability.total} rooms occupied`
                        : "No rooms configured yet."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
                      <span>Available</span>
                      <span className="font-semibold text-emerald-600">
                        {roomAvailability.available}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
                      <span>Occupied</span>
                      <span className="font-semibold text-sky-600">
                        {roomAvailability.occupied}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
                      <span>Cleaning</span>
                      <span className="font-semibold text-amber-600">
                        {roomAvailability.cleaning}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
                      <span>Maintenance</span>
                      <span className="font-semibold text-rose-600">
                        {roomAvailability.maintenance}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking by platform pie chart */}
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Bookings by platform
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                  <div className="h-[210px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platforms}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          labelLine={false}
                          label={{ fontSize: 11 }}
                        >
                          {platforms.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    {platforms.map((p, i) => (
                      <div
                        key={p.name}
                        className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="inline-block w-2 h-2 rounded-full"
                            style={{ backgroundColor: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }}
                          />
                          <span>{p.name}</span>
                        </div>
                        <span className="font-semibold">{p.value}</span>
                      </div>
                    ))}
                    {platforms.length === 0 && (
                      <p className="text-xs text-slate-500">
                        No booking data yet. Bookings will be grouped by payment method.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right tasks / alerts panel */}
          <div className="space-y-4">
            <Card className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Today’s operational checks
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-2 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Review {metrics.newBookingsToday || "new"} bookings
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Confirm room allocation and pre-arrival notes for all arrivals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-2 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      Monitor check-ins and check-outs
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Track guests that have arrived and rooms that need quick turnover.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-2 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {metrics.openComplaints > 0
                        ? `${metrics.openComplaints} open complaints`
                        : "No open complaints"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ensure all guest issues are acknowledged and assigned to staff.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}

