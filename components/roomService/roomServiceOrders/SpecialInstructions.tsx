'use client'

import { useMemo, useState } from "react"
import type { RoomServiceOrder } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, FileText, Save } from "lucide-react"

interface Props {
  orders: RoomServiceOrder[]
  onUpdateOrder: (
    id: string,
    patch: Partial<RoomServiceOrder> & { autoChargeToRoomBill?: boolean },
  ) => Promise<any>
}

export default function SpecialInstructions({ orders, onUpdateOrder }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const withNotes = useMemo(
    () => orders.filter((o) => o.specialInstructions && o.specialInstructions.trim()),
    [orders],
  )
  const withoutNotes = useMemo(
    () => orders.filter((o) => !o.specialInstructions || !o.specialInstructions.trim()),
    [orders],
  )

  const startEdit = (o: RoomServiceOrder) => {
    setEditingId(o.id)
    setText(o.specialInstructions || "")
  }

  const cancel = () => {
    setEditingId(null)
    setText("")
  }

  const save = async (id: string) => {
    setError(null)
    setSaving(id)
    try {
      await onUpdateOrder(id, {
        specialInstructions: text.trim() || null,
      })
      setEditingId(null)
      setText("")
    } catch (e: any) {
      setError(e?.message || "Failed to save instructions")
    } finally {
      setSaving(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Special Instructions
            <Badge className="bg-white/15 text-white border-none">
              Custom guest notes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Capture instructions such as &quot;Less spicy&quot;, &quot;No onion&quot;,
          &quot;Extra napkins&quot; and more.
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap=2">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Orders with instructions ({withNotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {withNotes.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No orders with special instructions yet.
              </div>
            ) : (
              withNotes.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-purple-200 bg-purple-50 p=3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-purple-900 truncate">
                        {o.orderNumber || "—"} • Room {o.roomNumber}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => startEdit(o)}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="text-xs text-purple-800">
                    {o.specialInstructions}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Orders without instructions ({withoutNotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y=2">
            {withoutNotes.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                All orders have instructions.
              </div>
            ) : (
              withoutNotes.slice(0, 10).map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • Room {o.roomNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.guestName || "Guest"}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => startEdit(o)}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {editingId && (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Edit special instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <Textarea
              aria-label="Special instructions"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Less spicy, no onion, lactose-free, etc."
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancel}
                disabled={saving === editingId}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={saving === editingId}
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => save(editingId)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

