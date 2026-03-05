'use client'

import { useState } from "react"
import type { FrontDeskGuestPreview } from "./RoomServiceOrders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle2, Search, ShieldCheck } from "lucide-react"

interface Props {
  onLookupGuest: (roomNumber: string) => Promise<FrontDeskGuestPreview | null>
}

export default function GuestVerification({ onLookupGuest }: Props) {
  const [roomNumber, setRoomNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guest, setGuest] = useState<FrontDeskGuestPreview | null>(null)

  const handleVerify = async () => {
    setError(null)
    setGuest(null)
    if (!roomNumber.trim()) {
      setError("Room number is required")
      return
    }
    setLoading(true)
    try {
      const result = await onLookupGuest(roomNumber.trim())
      if (!result) {
        setError("No active booking found for this room")
        return
      }
      setGuest(result)
    } catch (e: any) {
      setError(e?.message || "Failed to verify guest")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-slate-900 to-indigo-900 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Guest Verification
            <Badge className="bg-white/15 text-white border-none">
              Validate guest details
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Verify guest name and booking ID with the front desk before confirming
          room-service orders.
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

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Verify guest by room number
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="verify-room">Room number</Label>
              <Input
                id="verify-room"
                aria-label="Room number for verification"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="301"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerify()
                }}
              />
            </div>
            <Button
              type="button"
              disabled={loading}
              onClick={handleVerify}
              className="bg-slate-900 hover:bg-slate-950"
            >
              <Search className="h-4 w-4 mr-2" />
              Verify
            </Button>
          </div>

          {guest && (
            <Card className="rounded-xl border border-emerald-200 bg-emerald-50">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">
                    Guest verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-slate-600">Guest name</div>
                    <div className="font-semibold text-slate-900">
                      {guest.guestName}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Room</div>
                    <div className="font-semibold text-slate-900">
                      {guest.roomNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Booking number</div>
                    <div className="font-semibold text-slate-900">
                      {guest.bookingNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Status</div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {guest.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

