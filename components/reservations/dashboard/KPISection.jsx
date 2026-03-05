'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, Users, Ban } from 'lucide-react'

function AnimatedCounter({ value, duration = 600 }) {
  const [display, setDisplay] = useState(0)
  const num = Number(value) || 0

  useEffect(() => {
    const start = 0
    const end = num
    const startTime = Date.now()
    const step = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 2
      setDisplay(Math.round(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [num, duration])

  return <span>{display.toLocaleString()}</span>
}

const CARDS = [
  { key: 'totalReservations', label: 'Total Reservations', icon: CalendarDays, href: '/reservations/list', color: 'from-emerald-500 to-green-400' },
  { key: 'pendingConfirmations', label: 'Pending Confirmations', icon: Clock, href: '/reservations/list?status=pending', color: 'from-emerald-600 to-teal-500' },
  { key: 'groupBookings', label: 'Group Bookings', icon: Users, href: '/reservations/groups', color: 'from-green-500 to-emerald-400' },
  { key: 'cancellationsToday', label: 'Cancellations Today', icon: Ban, href: '/reservations/cancellation', color: 'from-teal-500 to-cyan-400' },
]

export default function KPISection({ kpis = {}, onClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((c) => {
        const Icon = c.icon
        return (
          <Card
            key={c.key}
            className={`border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br ${c.color} text-white cursor-pointer hover:scale-[1.02] transition-transform`}
            onClick={() => onClick?.(c.href)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/90 text-xs font-medium">{c.label}</p>
                  <p className="text-2xl font-bold mt-1">
                    <AnimatedCounter value={kpis[c.key] ?? 0} />
                  </p>
                </div>
                <Icon className="h-8 w-8 text-white/70" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

