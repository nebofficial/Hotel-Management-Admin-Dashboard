'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

export default function OverbookingAlert({ summary }) {
  if (!summary || !summary.length) return null

  return (
    <Alert variant="destructive" className="bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white border-0">
      <TriangleAlert className="h-5 w-5" />
      <AlertTitle className="font-bold">Overbooking Detected</AlertTitle>
      <AlertDescription className="text-sm">
        <div className="space-y-1 mt-1">
          {summary.map((s) => (
            <div key={`${s.roomType}-${s.date}`} className="flex items-center justify-between text-xs">
              <span>
                <span className="font-semibold">{s.roomType}</span> on <span>{s.date}</span>
              </span>
              <span className="font-semibold">{s.instances} room(s) overbooked</span>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}

