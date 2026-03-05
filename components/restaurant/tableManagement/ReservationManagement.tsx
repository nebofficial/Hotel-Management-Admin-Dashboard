'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Plus, Calendar, Clock } from "lucide-react"
import type { RestaurantTable, TableReservation } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  reservations: TableReservation[]
  onRefresh: () => void
}

export default function ReservationManagement({
  tables,
  reservations,
  onRefresh,
}: Props) {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    tableId: tables[0]?.id || "",
    tableNo: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    reservationDate: new Date().toISOString().slice(0, 10),
    reservationTime: "19:00",
    partySize: "2",
    specialRequests: "",
  })

  const handleCreate = async () => {
    if (!user?.hotelId || !form.tableId || !form.guestName.trim()) {
      setError("Table and guest name are required")
      return
    }

    const selectedTable = tables.find((t) => t.id === form.tableId)
    if (!selectedTable) {
      setError("Selected table not found")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/table-reservations`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableId: form.tableId,
            tableNo: selectedTable.tableNo,
            guestName: form.guestName.trim(),
            guestPhone: form.guestPhone.trim() || null,
            guestEmail: form.guestEmail.trim() || null,
            reservationDate: form.reservationDate,
            reservationTime: form.reservationTime,
            partySize: Number(form.partySize || 2),
            specialRequests: form.specialRequests.trim() || null,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to create reservation (HTTP ${res.status})`,
        )
      }

      setCreating(false)
      setForm({
        tableId: tables[0]?.id || "",
        tableNo: "",
        guestName: "",
        guestPhone: "",
        guestEmail: "",
        reservationDate: new Date().toISOString().slice(0, 10),
        reservationTime: "19:00",
        partySize: "2",
        specialRequests: "",
      })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create reservation")
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: TableReservation["status"]) => {
    const colors = {
      Pending: "bg-amber-100 text-amber-700 border-amber-200",
      Confirmed: "bg-green-100 text-green-700 border-green-200",
      Seated: "bg-blue-100 text-blue-700 border-blue-200",
      Completed: "bg-slate-100 text-slate-700 border-slate-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
      "No Show": "bg-orange-100 text-orange-700 border-orange-200",
    }
    return colors[status] || colors.Pending
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <Card className="rounded-2xl bg-linear-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-sm border-none flex-1">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Today's reservations
              </div>
              <div className="text-lg font-semibold">
                {reservations.length.toString().padStart(2, "0")}
              </div>
            </div>
            <Calendar className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Button
          size="sm"
          className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 ml-3"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          New reservation
        </Button>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Reservations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {reservations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No reservations for today. Click "New reservation" to create one.
              </div>
            ) : (
              reservations.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {res.guestName}
                      </span>
                      <Badge className={`border text-[10px] font-medium ${getStatusColor(res.status)}`}>
                        {res.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Table {res.tableNo} • {res.reservationTime} • Party of {res.partySize}
                    </div>
                    {res.specialRequests && (
                      <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                        {res.specialRequests}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>New reservation</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700" htmlFor="reservation-table">Table *</label>
              <select
                id="reservation-table"
                aria-label="Select table for reservation"
                value={form.tableId}
                onChange={(e) => {
                  const table = tables.find((t) => t.id === e.target.value)
                  setForm({
                    ...form,
                    tableId: e.target.value,
                    tableNo: table?.tableNo || "",
                  })
                }}
                className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tableNo} (Capacity: {t.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Guest name *</label>
              <Input
                value={form.guestName}
                onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                placeholder="Guest name"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Phone</label>
                <Input
                  value={form.guestPhone}
                  onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                  placeholder="Phone"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={form.guestEmail}
                  onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  placeholder="Email"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Date *</label>
                <Input
                  type="date"
                  value={form.reservationDate}
                  onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Time *</label>
                <Input
                  type="time"
                  value={form.reservationTime}
                  onChange={(e) => setForm({ ...form, reservationTime: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Party size</label>
              <Input
                type="number"
                value={form.partySize}
                onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                placeholder="2"
                min="1"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Special requests</label>
              <textarea
                value={form.specialRequests}
                onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                placeholder="Optional"
                className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                disabled={!form.tableId || !form.guestName.trim() || saving}
                onClick={handleCreate}
              >
                {saving ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
