"use client"

import { useEffect, useMemo, useState } from "react"
import { History, Calendar, Bed, CreditCard, Hash, DollarSign, XCircle } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "View past bookings",
  "Check-in / Check-out history",
  "Room history",
  "Payment history",
  "Total stays count",
  "Total revenue generated",
  "Cancellation history",
]

interface BookingRow {
  id: string
  guestId: string
  guestName: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: string
  totalAmount: number
}

interface PaymentRow {
  id: string
  guestId: string
  guestName: string
  amount: number
  status: string
  createdAt: string
}

interface GuestSummary {
  guestId: string
  guestName: string
  visits: number
  lastVisit: string | null
  totalSpent: number
  cancellations: number
}

export default function GuestHistoryPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      setError("No hotel associated with your account.")
      return
    }
    const token = localStorage.getItem("token")
    setLoading(true)
    setError(null)

    const fetchBookings = fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (r) => {
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to load bookings (${r.status})`)
      }
      return r.json()
    })

    const fetchPayments = fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (r) => {
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to load payments (${r.status})`)
      }
      return r.json()
    })

    Promise.allSettled([fetchBookings, fetchPayments])
      .then((results) => {
        const [bookingsResult, paymentsResult] = results
        if (bookingsResult.status === "fulfilled") {
          const raw = bookingsResult.value.bookings || []
          const mapped: BookingRow[] = raw.map((b: any) => ({
            id: String(b.id),
            guestId: String(b.guestId),
            guestName: String(b.guestName || ""),
            roomNumber: String(b.roomNumber || ""),
            checkIn: b.checkIn ? new Date(b.checkIn).toISOString().slice(0, 10) : "",
            checkOut: b.checkOut ? new Date(b.checkOut).toISOString().slice(0, 10) : "",
            status: String(b.status || "pending"),
            totalAmount: Number(b.totalAmount || 0),
          }))
          setBookings(mapped)
        } else {
          console.error(bookingsResult.reason)
          setBookings([])
          setError(bookingsResult.reason instanceof Error ? bookingsResult.reason.message : "Failed to load bookings")
        }

        if (paymentsResult.status === "fulfilled") {
          const raw = paymentsResult.value.payments || []
          const mapped: PaymentRow[] = raw.map((p: any) => ({
            id: String(p.id),
            guestId: String(p.guestId),
            guestName: String(p.guestName || ""),
            amount: Number(p.amount || 0),
            status: String(p.status || "pending"),
            createdAt: p.createdAt ? new Date(p.createdAt).toISOString().slice(0, 10) : "",
          }))
          setPayments(mapped)
        } else {
          console.error(paymentsResult.reason)
          setPayments([])
          if (!error) {
            setError(
              paymentsResult.reason instanceof Error
                ? paymentsResult.reason.message
                : "Failed to load payments"
            )
          }
        }
      })
      .finally(() => setLoading(false))
  }, [user?.hotelId])

  const summaries: GuestSummary[] = useMemo(() => {
    const byGuest = new Map<string, GuestSummary>()

    // Aggregate bookings: visits, lastVisit, cancellations
    for (const b of bookings) {
      const key = b.guestId || b.guestName
      if (!key) continue
      const existing = byGuest.get(key) || {
        guestId: b.guestId,
        guestName: b.guestName || "—",
        visits: 0,
        lastVisit: null as string | null,
        totalSpent: 0,
        cancellations: 0,
      }
      if (b.status === "cancelled") {
        existing.cancellations += 1
      } else {
        existing.visits += 1
        const date = b.checkOut || b.checkIn
        if (date) {
          if (!existing.lastVisit || date > existing.lastVisit) {
            existing.lastVisit = date
          }
        }
      }
      byGuest.set(key, existing)
    }

    // Aggregate payments: totalSpent
    for (const p of payments) {
      if (p.status !== "completed") continue
      const key = p.guestId || p.guestName
      if (!key) continue
      const existing = byGuest.get(key) || {
        guestId: p.guestId,
        guestName: p.guestName || "—",
        visits: 0,
        lastVisit: null as string | null,
        totalSpent: 0,
        cancellations: 0,
      }
      existing.totalSpent += p.amount || 0
      byGuest.set(key, existing)
    }

    return Array.from(byGuest.values()).sort((a, b) =>
      (a.guestName || "").localeCompare(b.guestName || "")
    )
  }, [bookings, payments])

  const totalStays = summaries.reduce((sum, s) => sum + s.visits, 0)
  const totalRevenue = summaries.reduce((sum, s) => sum + s.totalSpent, 0)
  const totalCancellations = summaries.reduce((sum, s) => sum + s.cancellations, 0)
  const totalCheckInOutRecords = bookings.length

  return (
    <main className="p-4 space-y-6">
      <GuestSectionHeader
        icon={History}
        title="Guest History"
        description="View past bookings, check-in/check-out history, room and payment history, total stays, revenue, and cancellations."
      />

      <Accordion type="single" collapsible className="border border-gray-200 rounded-lg bg-gray-50/50">
        <AccordionItem value="sub-features" className="border-b-0 px-4">
          <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
            Sub-features
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600 list-disc list-inside">
              {SUB_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Hash className="h-3.5 w-3.5" /> Total stays
            </p>
            <p className="text-lg font-semibold text-gray-900">{totalStays}</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" /> Total revenue
            </p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Check-in/out records
            </p>
            <p className="text-lg font-semibold text-gray-900">{totalCheckInOutRecords}</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" /> Cancellations
            </p>
            <p className="text-lg font-semibold text-red-600">{totalCancellations}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="summary">Summary by guest</TabsTrigger>
          <TabsTrigger value="bookings">Past bookings</TabsTrigger>
          <TabsTrigger value="payments">Payment history</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Guest visit summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Loading guest history…</p>
              ) : summaries.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No history found yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Guest</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Visits</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Last visit</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Total spent</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Cancellations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaries.map((row) => (
                        <tr key={row.guestId} className="border-b border-gray-100 hover:bg-gray-50/60">
                          <td className="px-3 py-2 font-medium text-gray-900">{row.guestName}</td>
                          <td className="px-3 py-2 text-gray-600">{row.visits}</td>
                          <td className="px-3 py-2 text-gray-600">
                            {row.lastVisit ? row.lastVisit : "—"}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-900">
                            ₹{row.totalSpent.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-gray-600">{row.cancellations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bed className="h-4 w-4 text-slate-600" />
                Past bookings (check-in / check-out history)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Loading bookings…</p>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No bookings found.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Guest</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Room</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Check-in
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Check-out
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50/60"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">{row.guestName}</td>
                          <td className="px-3 py-2 text-gray-600">{row.roomNumber}</td>
                          <td className="px-3 py-2 text-gray-600">{row.checkIn}</td>
                          <td className="px-3 py-2 text-gray-600">{row.checkOut}</td>
                          <td className="px-3 py-2 text-gray-700 capitalize">
                            {row.status.replace(/_/g, " ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-600" />
                Payment history
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Loading payments…</p>
              ) : payments.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No payments found.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Guest</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50/60"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">{row.guestName}</td>
                          <td className="px-3 py-2 font-medium text-gray-900">
                            ₹{row.amount.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-gray-700 capitalize">{row.status}</td>
                          <td className="px-3 py-2 text-gray-600">{row.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
