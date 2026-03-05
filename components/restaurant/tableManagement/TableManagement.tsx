'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  RefreshCw,
  Table as TableIcon,
} from "lucide-react"
import TableCRUD from "./TableCRUD"
import TableStatusTracking from "./TableStatusTracking"
import ReservationManagement from "./ReservationManagement"
import AssignWaiter from "./AssignWaiter"
import MergeSplitTables from "./MergeSplitTables"
import FloorLayoutView from "./FloorLayoutView"
import TableCapacitySetting from "./TableCapacitySetting"
import RealTimeAvailability from "./RealTimeAvailability"
import QRCodeGenerator from "./QRCodeGenerator"
import AutoStatusAfterBilling from "./AutoStatusAfterBilling"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface RestaurantTable {
  id: string
  tableNo: string
  floor: string | null
  capacity: number
  status: "Available" | "Occupied" | "Reserved" | "Cleaning" | "Out of Service"
  currentGuestName: string | null
  currentGuestPhone: string | null
  assignedWaiterId: string | null
  assignedWaiterName: string | null
  positionX: number | null
  positionY: number | null
  qrCode: string | null
  mergedWith: string[]
  notes: string | null
}

export interface TableReservation {
  id: string
  tableId: string
  tableNo: string
  guestName: string
  guestPhone: string | null
  guestEmail: string | null
  reservationDate: string
  reservationTime: string
  duration: number
  partySize: number
  status: "Pending" | "Confirmed" | "Seated" | "Completed" | "Cancelled" | "No Show"
  specialRequests: string | null
  confirmedBy: string | null
}

export default function TableManagement() {
  const { user } = useAuth()
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [reservations, setReservations] = useState<TableReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!user?.hotelId) {
      setError("Hotel not selected. Please login again.")
      setLoading(false)
      return
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [tablesRes, reservationsRes] = await Promise.all([
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/table-reservations?reservationDate=${new Date().toISOString().slice(0, 10)}`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ])

      const tablesJson = tablesRes.ok
        ? await tablesRes.json().catch(() => ({}))
        : {}
      const reservationsJson = reservationsRes.ok
        ? await reservationsRes.json().catch(() => ({}))
        : {}

      const tbls = (tablesJson as any).tables || []
      setTables(
        tbls.map((t: any) => ({
          id: String(t.id),
          tableNo: String(t.tableNo),
          floor: t.floor ? String(t.floor) : null,
          capacity: Number(t.capacity || 2),
          status: t.status || "Available",
          currentGuestName: t.currentGuestName ? String(t.currentGuestName) : null,
          currentGuestPhone: t.currentGuestPhone ? String(t.currentGuestPhone) : null,
          assignedWaiterId: t.assignedWaiterId ? String(t.assignedWaiterId) : null,
          assignedWaiterName: t.assignedWaiterName ? String(t.assignedWaiterName) : null,
          positionX: t.positionX != null ? Number(t.positionX) : null,
          positionY: t.positionY != null ? Number(t.positionY) : null,
          qrCode: t.qrCode ? String(t.qrCode) : null,
          mergedWith: Array.isArray(t.mergedWith) ? t.mergedWith.map(String) : [],
          notes: t.notes ? String(t.notes) : null,
        })),
      )

      const resvs = (reservationsJson as any).reservations || []
      setReservations(
        resvs.map((r: any) => ({
          id: String(r.id),
          tableId: String(r.tableId),
          tableNo: String(r.tableNo),
          guestName: String(r.guestName),
          guestPhone: r.guestPhone ? String(r.guestPhone) : null,
          guestEmail: r.guestEmail ? String(r.guestEmail) : null,
          reservationDate: String(r.reservationDate),
          reservationTime: String(r.reservationTime),
          duration: Number(r.duration || 120),
          partySize: Number(r.partySize || 2),
          status: r.status || "Pending",
          specialRequests: r.specialRequests ? String(r.specialRequests) : null,
          confirmedBy: r.confirmedBy ? String(r.confirmedBy) : null,
        })),
      )
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load table data. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.hotelId])

  if (loading) {
    return (
      <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <div className="pb-1">
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-blue-600" />
            Table management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Loading table data…</p>
        </div>
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 flex items-center justify-center text-sm text-slate-500">
            Loading tables and reservations from backend…
          </CardContent>
        </Card>
      </main>
    )
  }

  const statusCounts = {
    Available: tables.filter((t) => t.status === "Available").length,
    Occupied: tables.filter((t) => t.status === "Occupied").length,
    Reserved: tables.filter((t) => t.status === "Reserved").length,
    Cleaning: tables.filter((t) => t.status === "Cleaning").length,
    "Out of Service": tables.filter((t) => t.status === "Out of Service").length,
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-blue-600" />
            Table management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage restaurant tables, reservations, floor layouts, waiter assignments,
            and real-time availability tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading || !user?.hotelId}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Card className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Total
            </span>
            <span className="text-lg font-semibold">
              {tables.length.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Available
            </span>
            <span className="text-lg font-semibold">
              {statusCounts.Available.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-red-500 to-rose-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Occupied
            </span>
            <span className="text-lg font-semibold">
              {statusCounts.Occupied.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Reserved
            </span>
            <span className="text-lg font-semibold">
              {statusCounts.Reserved.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Cleaning
            </span>
            <span className="text-lg font-semibold">
              {statusCounts.Cleaning.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="crud" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="crud">Tables</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="waiter">Waiter</TabsTrigger>
          <TabsTrigger value="merge">Merge/Split</TabsTrigger>
          <TabsTrigger value="layout">Floor layout</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="qr">QR codes</TabsTrigger>
          <TabsTrigger value="auto">Auto status</TabsTrigger>
        </TabsList>

        <TabsContent value="crud" className="space-y-3">
          <TableCRUD tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="status" className="space-y-3">
          <TableStatusTracking tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="reservations" className="space-y-3">
          <ReservationManagement
            tables={tables}
            reservations={reservations}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="waiter" className="space-y-3">
          <AssignWaiter tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="merge" className="space-y-3">
          <MergeSplitTables tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="layout" className="space-y-3">
          <FloorLayoutView tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="capacity" className="space-y-3">
          <TableCapacitySetting tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="realtime" className="space-y-3">
          <RealTimeAvailability tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="qr" className="space-y-3">
          <QRCodeGenerator tables={tables} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="auto" className="space-y-3">
          <AutoStatusAfterBilling tables={tables} onRefresh={loadData} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
