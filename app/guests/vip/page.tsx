"use client"

import { useEffect, useState } from "react"
import { Crown, ShieldOff } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "Mark guest as VIP",
  "Mark guest as Blacklisted",
  "Add special preferences (room type, food, floor, etc.)",
  "Add internal staff notes",
  "View previous notes",
  "Restrict booking for blacklisted guests",
]

interface VipGuestRow {
  id: string
  name: string
  status: "VIP" | "BLACKLIST" | "NORMAL"
  level: string
  joinDate: string
  notes: string
  restrictBooking: boolean
}

export default function VIPPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<VipGuestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = () => {
    if (!user?.hotelId) {
      setError("No hotel associated with your account.")
      setRows([])
      setLoading(false)
      return
    }
    const token = localStorage.getItem("token")
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/guests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}))
          throw new Error(data?.message || `Failed to load guests (${r.status})`)
        }
        return r.json()
      })
      .then((data) => {
        const guests = data.guests || []
        const mapped: VipGuestRow[] = guests.map((g: any) => {
          const prefs = g.preferences || {}
          // Normalize stored status to VIP / BLACKLIST / NORMAL
          let status: VipGuestRow["status"] = "NORMAL"
          const rawStatus = String(prefs.vipStatus || "").toUpperCase()
          if (rawStatus === "VIP") status = "VIP"
          else if (rawStatus === "BLACKLIST" || rawStatus === "BLACKLISTED") status = "BLACKLIST"

          const joinDate =
            prefs.vipJoinDate && typeof prefs.vipJoinDate === "string"
              ? prefs.vipJoinDate.slice(0, 10)
              : ""
          return {
            id: String(g.id),
            name: [g.firstName, g.lastName].filter(Boolean).join(" ") || g.email || "—",
            status,
            level: prefs.vipLevel || "—",
            joinDate: joinDate || "—",
            notes: prefs.vipNotes || "",
            restrictBooking: Boolean(prefs.restrictBooking),
          }
        })
        setRows(mapped)
      })
      .catch((e) => {
        console.error(e)
        setError(e instanceof Error ? e.message : "Failed to load VIP / Blacklist data.")
        setRows([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchGuests()
  }, [user?.hotelId])

  const updateStatus = async (row: VipGuestRow, newStatus: "VIP" | "BLACKLIST" | "NORMAL") => {
    if (!user?.hotelId) return
    setSavingId(row.id)
    setError(null)
    const token = localStorage.getItem("token")
    try {
      const preferences: any = {
        vipStatus: newStatus === "NORMAL" ? null : newStatus,
      }
      // On first time VIP, set join date
      if (newStatus === "VIP" && !row.joinDate) {
        preferences.vipJoinDate = new Date().toISOString()
      }
      // Blacklist ⇒ restrict bookings, clear VIP; VIP / NORMAL ⇒ allow bookings
      if (newStatus === "BLACKLIST") {
        preferences.restrictBooking = true
      } else {
        preferences.restrictBooking = false
      }

      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/guests/${row.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferences }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to update status (${res.status})`)
      }
      // Optimistically update local state without full refetch
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                status: newStatus,
                restrictBooking: newStatus === "BLACKLIST",
                joinDate:
                  newStatus === "VIP" && (!r.joinDate || r.joinDate === "—")
                    ? new Date().toISOString().slice(0, 10)
                    : r.joinDate,
              }
            : r,
        ),
      )
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : "Failed to update VIP / Blacklist status.")
    } finally {
      setSavingId(null)
    }
  }

  const setLevel = async (row: VipGuestRow, level: string) => {
    if (!user?.hotelId) return
    setSavingId(row.id)
    setError(null)
    const token = localStorage.getItem("token")
    try {
      const preferences: any = {
        vipLevel: level === "—" ? null : level,
      }
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/guests/${row.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ preferences }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to update level (${res.status})`)
      }
      // Optimistically update level in local state
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, level: level === "—" ? "—" : level } : r)),
      )
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : "Failed to update VIP level.")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <main className="p-4 space-y-6">
      <GuestSectionHeader
        icon={Crown}
        title="VIP / Blacklist / Preferences & Notes"
        description="Manage VIP status, blacklisted guests, special preferences, and internal staff notes. Blacklisted guests can be restricted from booking."
      />

      <Accordion type="single" collapsible className="border border-gray-200 rounded-lg bg-gray-50/50">
        <AccordionItem value="sub-features" className="border-b-0 px-4">
          <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
            Sub-features
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 list-disc list-inside">
              {SUB_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-gray-500">
              For detailed preferences and notes, see{" "}
              <Link href="/guests/preferences" className="text-blue-600 hover:underline">
                Preferences & Notes
              </Link>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-600" />
            VIP & Blacklist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {loading ? (
            <p className="text-sm text-gray-500 py-4">Loading VIP / Blacklist data…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No VIP or blacklisted guests yet. Mark guests from this page or guest profiles.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Guest</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Level</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Join date</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Notes / Preferences
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Booking restriction
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
                  {rows.map((g) => (
                    <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="px-3 py-2 font-medium text-gray-900">{g.name}</td>
                  <td className="px-3 py-2">
                        <Badge
                          className={
                          g.status === "VIP"
                            ? "bg-amber-100 text-amber-800"
                            : g.status === "BLACKLIST"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-700"
                          }
                        >
                        {g.status === "BLACKLIST" && <ShieldOff className="h-3 w-3 mr-1 inline" />}
                        {g.status === "NORMAL" ? "NORMAL" : g.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{g.level}</td>
                      <td className="px-3 py-2 text-gray-600">{g.joinDate}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[220px] truncate" title={g.notes}>
                        {g.notes || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {g.restrictBooking ? (
                          <Badge className="bg-red-100 text-red-800">Restricted</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800">Allowed</Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={savingId === g.id}
                          onClick={() => updateStatus(g, "VIP")}
                        >
                          Set VIP
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={savingId === g.id}
                          onClick={() => updateStatus(g, "Blacklist")}
                        >
                          Blacklist
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          disabled={savingId === g.id}
                          onClick={() => updateStatus(g, "None")}
                        >
                          Clear
                        </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Blacklisted guests are restricted from making new bookings (flag stored as{" "}
            <code>restrictBooking</code> in preferences).
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
