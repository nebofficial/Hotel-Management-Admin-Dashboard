"use client"

import { useEffect, useState } from "react"
import { UserPlus, Users, Pencil, Trash2, Phone, BedDouble, AlertCircle, RefreshCw } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { GuestFormDialog } from "@/components/guests/guest-form-dialog"
import { GuestViewContactDialog } from "@/components/guests/guest-view-contact-dialog"
import { GuestViewRoomDialog } from "@/components/guests/guest-view-room-dialog"
import { GuestUploadIdDialog } from "@/components/guests/guest-upload-id-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "Add new guest",
  "Edit guest details",
  "Delete guest record",
  "Upload ID proof",
  "View contact information",
  "View current room allocation",
  "Emergency contact details",
]

interface GuestRow {
  id: string
  name: string
  email: string
  phone: string
  room: string
  emergencyContact: string
  tier: string
  visits: number
}

function tierFromPoints(points: number): string {
  if (points >= 5000) return "Platinum"
  if (points >= 2000) return "Gold"
  if (points >= 500) return "Silver"
  return "Bronze"
}

export default function GuestProfilesPage() {
  const { user } = useAuth()
  const [guests, setGuests] = useState<GuestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [selectedGuestName, setSelectedGuestName] = useState("")
  const [viewContactOpen, setViewContactOpen] = useState(false)
  const [viewRoomOpen, setViewRoomOpen] = useState(false)
  const [uploadIdOpen, setUploadIdOpen] = useState(false)
  const [editGuestId, setEditGuestId] = useState<string | null>(null)
  const [deleteGuestId, setDeleteGuestId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchGuests = () => {
    if (!user?.hotelId) {
      setError("No hotel associated with your account.")
      setGuests([])
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
          setError(data?.message || `Failed to load guests (${r.status})`)
          return { guests: [] }
        }
        return r.json()
      })
      .then((data) => {
        const list = (data.guests || []).map((g: {
          id: string
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          preferences?: { emergencyContactName?: string; emergencyContactPhone?: string }
          loyaltyPoints?: number
        }) => {
          const prefs = g.preferences || {}
          const emergencyName = prefs.emergencyContactName || ""
          const emergencyPhone = prefs.emergencyContactPhone || ""
          const emergency =
            emergencyName || emergencyPhone
              ? [emergencyName, emergencyPhone].filter(Boolean).join(" · ")
              : "—"
          return {
            id: g.id,
            name: [g.firstName, g.lastName].filter(Boolean).join(" ").trim() || "—",
            email: g.email || "—",
            phone: g.phone || "—",
            room: "—",
            emergencyContact: emergency,
            tier: tierFromPoints(typeof g.loyaltyPoints === "number" ? g.loyaltyPoints : 0),
            visits: 0,
          }
        })
        setGuests(list)
      })
      .catch((err) => {
        console.error("Error fetching guests:", err)
        setError("Unable to load guests. Check that the server is running.")
        setGuests([])
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

  const openForGuest = (g: GuestRow, action: "contact" | "room" | "upload" | "edit" | "delete") => {
    setSelectedGuestId(g.id)
    setSelectedGuestName(g.name)
    if (action === "contact") setViewContactOpen(true)
    if (action === "room") setViewRoomOpen(true)
    if (action === "upload") setUploadIdOpen(true)
    if (action === "edit") setEditGuestId(g.id)
    if (action === "delete") setDeleteGuestId(g.id)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteGuestId || !user?.hotelId) return
    setDeleting(true)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/guests/${deleteGuestId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) {
        setDeleteGuestId(null)
        fetchGuests()
      }
    } finally {
      setDeleting(false)
    }
  }

  const getTierColor = (tier: string) => {
    if (tier === "Platinum") return "bg-purple-100 text-purple-800"
    if (tier === "Gold") return "bg-amber-100 text-amber-800"
    if (tier === "Silver") return "bg-slate-200 text-slate-800"
    return "bg-blue-100 text-blue-800"
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 p-4 md:p-6 space-y-6">
      <GuestSectionHeader
        icon={Users}
        title="Guest Profile"
        description="Manage guest profiles, contact details, ID proof, room allocation, and emergency contacts."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchGuests()}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setAddOpen(true)}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Add guest
            </Button>
          </div>
        }
      />

      <Accordion type="single" collapsible className="border border-indigo-100 rounded-xl bg-white/80 shadow-sm overflow-hidden">
        <AccordionItem value="sub-features" className="border-b-0 px-4">
          <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline py-3">
            Sub-features
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 list-disc list-inside pb-2">
              {SUB_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="border border-slate-200/80 shadow-md rounded-xl overflow-hidden bg-white">
        <CardHeader className="pb-2 pt-5 px-5 bg-linear-to-r from-slate-50 to-indigo-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
            <Users className="h-4 w-4 text-indigo-600" />
            All guests ({guests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4">
          {error && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : guests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No guests yet</p>
              <p className="text-sm mt-1">Click “Add guest” to add your first guest. Details will be saved and shown here.</p>
              <Button
                size="sm"
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setAddOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add guest
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Guest</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Contact</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Room allocation</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Emergency contact</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Tier / Visits</th>
                    <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g.id} className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-slate-900">{g.name}</p>
                        <p className="text-xs text-slate-500">{g.email}</p>
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {g.phone}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700">
                        {g.room !== "—" ? (
                          <span className="inline-flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5 text-indigo-500" />
                            Room {g.room}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 max-w-[160px] truncate" title={g.emergencyContact}>
                        {g.emergencyContact !== "—" ? (
                          <span className="inline-flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            {g.emergencyContact}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge className={getTierColor(g.tier)}>{g.tier}</Badge>
                        {g.visits > 0 && (
                          <span className="ml-1.5 text-xs text-slate-500">{g.visits} visits</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => openForGuest(g, "contact")}>
                              View contact information
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openForGuest(g, "room")}>
                              View room allocation
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openForGuest(g, "upload")}>
                              Upload ID proof photo
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openForGuest(g, "edit")}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit guest details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openForGuest(g, "delete")}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete guest record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {user?.hotelId && (
        <>
          <GuestFormDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            hotelId={user.hotelId}
            onSuccess={fetchGuests}
          />
          <GuestFormDialog
            open={Boolean(editGuestId)}
            onOpenChange={(open) => !open && setEditGuestId(null)}
            hotelId={user.hotelId}
            onSuccess={() => { setEditGuestId(null); fetchGuests() }}
            guestId={editGuestId}
          />
          <GuestViewContactDialog
            open={viewContactOpen}
            onOpenChange={setViewContactOpen}
            hotelId={user.hotelId}
            guestId={selectedGuestId}
          />
          <GuestViewRoomDialog
            open={viewRoomOpen}
            onOpenChange={setViewRoomOpen}
            guestName={selectedGuestName}
            roomAllocation={guests.find((x) => x.id === selectedGuestId)?.room ?? null}
          />
          <GuestUploadIdDialog
            open={uploadIdOpen}
            onOpenChange={setUploadIdOpen}
            hotelId={user.hotelId}
            guestId={selectedGuestId}
            onSuccess={fetchGuests}
          />
        </>
      )}

      <AlertDialog open={!!deleteGuestId} onOpenChange={(open) => !open && setDeleteGuestId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete guest record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the guest from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
