"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Activity,
  Layers,
  MoreVertical,
  RefreshCw,
  CheckCircle2,
  User2,
  CalendarClock,
  Sparkles,
  Wrench,
} from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { RoomSectionHeader } from "@/components/rooms/room-section-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const STATUS_CONFIG = [
  {
    key: "available",
    label: "Vacant",
    description: "Ready for new guests",
    color: "bg-green-100 text-green-800",
    ring: "ring-2 ring-green-200",
    icon: CheckCircle2,
  },
  {
    key: "occupied",
    label: "Occupied",
    description: "Currently in use",
    color: "bg-red-100 text-red-800",
    ring: "ring-2 ring-red-200",
    icon: User2,
  },
  {
    key: "reserved",
    label: "Reserved",
    description: "Booked but not yet checked in",
    color: "bg-purple-100 text-purple-800",
    ring: "ring-2 ring-purple-200",
    icon: CalendarClock,
  },
  {
    key: "cleaning",
    label: "Under cleaning",
    description: "Housekeeping in progress",
    color: "bg-sky-100 text-sky-800",
    ring: "ring-2 ring-sky-200",
    icon: Sparkles,
  },
  {
    key: "maintenance",
    label: "Under maintenance",
    description: "Not available due to maintenance",
    color: "bg-amber-100 text-amber-800",
    ring: "ring-2 ring-amber-200",
    icon: Wrench,
  },
] as const

export default function RoomStatusPage() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<{ status: string }[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRooms = useCallback(() => {
    if (!user?.hotelId) return
    const token = localStorage.getItem("token")
    setLoading(true)
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : { rooms: [] }))
      .then((data) => setRooms(data.rooms || []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }, [user?.hotelId])

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchRooms()
  }, [user?.hotelId, fetchRooms])

  const total = rooms.length
  const byStatus = STATUS_CONFIG.map((cfg) => {
    const keyLower = cfg.key.toLowerCase()
    const count = rooms.filter((r) => (r.status || "available").toLowerCase() === keyLower).length
    const percentageNum = total > 0 ? Math.round((count / total) * 100) : 0
    const percentage = `${percentageNum}%`
    return { ...cfg, count, percentage, percentageNum }
  })

  return (
    <main className="p-4 space-y-6">
      <RoomSectionHeader
        icon={Activity}
        title="Room Status"
        description="The system fetches real-time data from the backend for all modules, including Room Status, Floor Management, Housekeeping Assignments, and Maintenance Requests. All records are loaded dynamically from the database and displayed on their respective pages. Any updates made in one module are immediately reflected across related sections, ensuring accurate status tracking, smooth operations, and centralized hotel management."
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={fetchRooms}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {byStatus.map((item) => {
          const Icon = item.icon
          const hasRooms = item.count > 0
          return (
            <Card
              key={item.key}
              className={`border shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-0.5 ${
                hasRooms ? item.ring : ""
              }`}
            >
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${item.color} bg-opacity-80`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                      <p className="text-[11px] text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <Badge className={item.color}>{item.percentage}</Badge>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                  {hasRooms && (
                    <span className="text-[11px] text-gray-500 animate-pulse">
                      Status updated
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-2">
          <Layers className="h-4 w-4 text-amber-600" />
          <CardTitle className="text-sm font-semibold">Status breakdown</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="space-y-3">
            {byStatus.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-[width] duration-500"
                      style={{
                        width: total > 0 ? `${(item.count / total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-10 text-right">
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
