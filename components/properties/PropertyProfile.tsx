"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, MapPin, Phone, User } from "lucide-react"
import { PropertyCapacityPanel } from "./PropertyCapacityPanel"

interface PropertyProfileProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  profile: {
    hotel: { name: string; address: string; phone: string; email: string }
    totalRooms: number
    roomCategories: { name: string; count: number }[]
    managers: { name: string; email: string }[]
  } | null
  loading?: boolean
}

export function PropertyProfile(props: PropertyProfileProps) {
  const { open, onOpenChange, profile, loading } = props
  if (!profile) return null

  const { hotel, totalRooms, roomCategories, managers } = profile

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-xl border-0 bg-slate-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Property Profile</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-white/70">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-white/10 p-4">
              <h3 className="font-semibold text-white">{hotel.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-white/90">
                <div className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" />{hotel.address}</div>
                <div className="flex gap-2"><Phone className="h-4 w-4 shrink-0" />{hotel.phone}</div>
                <div className="flex gap-2"><Mail className="h-4 w-4 shrink-0" />{hotel.email}</div>
              </div>
            </div>
            {managers.length > 0 && (
              <div className="rounded-lg bg-white/10 p-4">
                <h4 className="flex gap-2 font-medium text-white"><User className="h-4 w-4" />Managers</h4>
                <ul className="mt-1 space-y-0.5 text-sm text-white/90">
                  {managers.map((m) => (
                    <li key={m.email}>{m.name} ({m.email})</li>
                  ))}
                </ul>
              </div>
            )}
            <PropertyCapacityPanel totalRooms={totalRooms} roomCategories={roomCategories} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
