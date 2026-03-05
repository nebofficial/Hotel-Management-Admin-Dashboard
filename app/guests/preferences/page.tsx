"use client"

import { useEffect, useState } from "react"
import { StickyNote, FileText } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "Add special preferences (room type, food, floor, etc.)",
  "Add internal staff notes",
  "View previous notes",
]

interface PrefRow {
  id: string
  guestName: string
  roomType: string
  floor: string
  food: string
  notes: string
}

export default function PreferencesPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<PrefRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [editing, setEditing] = useState<PrefRow | null>(null)
  const [editForm, setEditForm] = useState({
    roomType: "",
    floor: "",
    food: "",
    notes: "",
  })
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const openEdit = (row: PrefRow) => {
    setEditing(row)
    setEditForm({
      roomType: row.roomType === "—" ? "" : row.roomType,
      floor: row.floor === "—" ? "" : row.floor,
      food: row.food === "—" ? "" : row.food,
      notes: row.notes,
    })
    setEditError(null)
    setEditOpen(true)
  }

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
        const mapped: PrefRow[] = guests.map((g: any) => {
          const prefs = g.preferences || {}
          return {
            id: String(g.id),
            guestName: [g.firstName, g.lastName].filter(Boolean).join(" ") || g.email || "—",
            roomType: prefs.prefRoomType || "—",
            floor: prefs.prefFloor || "—",
            food: prefs.prefFood || "—",
            notes: prefs.prefNotes || "",
          }
        })
        setRows(mapped)
      })
      .catch((e) => {
        console.error(e)
        setError(e instanceof Error ? e.message : "Failed to load preferences.")
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

  const saveEdit = async () => {
    if (!editing || !user?.hotelId) return
    setSaving(true)
    setEditError(null)
    const token = localStorage.getItem("token")
    try {
      const preferences: any = {
        prefRoomType: editForm.roomType.trim() || null,
        prefFloor: editForm.floor.trim() || null,
        prefFood: editForm.food.trim() || null,
        prefNotes: editForm.notes.trim() || "",
      }
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/guests/${editing.id}`,
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
        throw new Error(data?.message || `Failed to update preferences (${res.status})`)
      }
      // Optimistically update UI
      setRows((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? {
                ...r,
                roomType: editForm.roomType.trim() || "—",
                floor: editForm.floor.trim() || "—",
                food: editForm.food.trim() || "—",
                notes: editForm.notes,
              }
            : r
        )
      )
      setEditOpen(false)
      setEditing(null)
    } catch (e) {
      console.error(e)
      setEditError(e instanceof Error ? e.message : "Failed to save preferences.")
    } finally {
      setSaving(false)
    }
  }

  const saveAdd = async () => {
    if (!user?.hotelId) return
    // For Add we need to choose a guest; here we'll simply reuse the edit dialog on an existing guest row.
    // A full guest selector can be added later; for now, Add will behave like Edit for the selected row.
  }

  return (
    <main className="p-4 space-y-6">
      <GuestSectionHeader
        icon={StickyNote}
        title="Preferences & Notes"
        description="Manage guest preferences (room type, food, floor) and internal staff notes. View previous notes per guest."
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-600" />
            Guest preferences & notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {loading ? (
            <p className="text-sm text-gray-500 py-4">Loading preferences…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No preferences recorded yet. Edit a guest to add room, floor, food preferences and notes.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Guest</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Room type</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Floor</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Food</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Notes</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="px-3 py-2 font-medium text-gray-900">{row.guestName}</td>
                      <td className="px-3 py-2 text-gray-600">{row.roomType}</td>
                      <td className="px-3 py-2 text-gray-600">{row.floor}</td>
                      <td className="px-3 py-2 text-gray-600">{row.food}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-[220px]">{row.notes || "—"}</td>
                      <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => openEdit(row)}
                        >
                          Add
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={async () => {
                            if (!user?.hotelId) return
                            const token = localStorage.getItem("token")
                            try {
                              const res = await fetch(
                                `${API_BASE}/api/hotel-data/${user.hotelId}/guests/${row.id}`,
                                {
                                  method: "PUT",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    preferences: {
                                      prefRoomType: null,
                                      prefFloor: null,
                                      prefFood: null,
                                      prefNotes: "",
                                    },
                                  }),
                                }
                              )
                              if (!res.ok) {
                                const data = await res.json().catch(() => ({}))
                                throw new Error(data?.message || `Failed to delete preferences (${res.status})`)
                              }
                              // Clear in UI
                              setRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id
                                    ? { ...r, roomType: "—", floor: "—", food: "—", notes: "" }
                                    : r
                                )
                              )
                            } catch (e) {
                              console.error(e)
                              setError(
                                e instanceof Error
                                  ? e.message
                                  : "Failed to delete preferences."
                              )
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={(open) => { if (!open) { setEditOpen(false); setEditing(null); } }}>
        <DialogContent className="sm:max-w-lg bg-white shadow-xl" showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit preferences & notes</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <p className="text-xs text-gray-500">
                Guest: <span className="font-medium text-gray-900">{editing.guestName}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pref-roomType">Preferred room type</Label>
                  <Input
                    id="pref-roomType"
                    placeholder="e.g. Suite, Double"
                    value={editForm.roomType}
                    onChange={(e) => setEditForm((p) => ({ ...p, roomType: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pref-floor">Preferred floor</Label>
                  <Input
                    id="pref-floor"
                    placeholder="e.g. High Floor"
                    value={editForm.floor}
                    onChange={(e) => setEditForm((p) => ({ ...p, floor: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pref-food">Food preferences</Label>
                <Input
                  id="pref-food"
                  placeholder="e.g. Vegetarian, Vegan, No spicy"
                  value={editForm.food}
                  onChange={(e) => setEditForm((p) => ({ ...p, food: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pref-notes">Internal staff notes</Label>
                <Textarea
                  id="pref-notes"
                  placeholder="Add internal notes about this guest's preferences..."
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={4}
                />
              </div>
              {editError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setEditOpen(false); setEditing(null); }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
