'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentMarketingActivity({ items = [] }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-slate-700/80">
        <CardTitle className="text-sm font-semibold text-slate-50">Recent Marketing Activity</CardTitle>
        <p className="text-[11px] text-slate-300">
          Latest campaigns, rate changes and marketing-driven bookings.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No recent marketing activity recorded in this period.
          </p>
        ) : (
          <ul className="divide-y divide-slate-800/80 text-xs">
            {items.map((item) => (
              <li key={item.id} className="px-4 py-2.5 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-medium text-slate-50">{item.title}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{item.description}</p>
                  {(item.roomType || item.ratePlan) && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.roomType && <span>Room: {item.roomType}</span>}
                      {item.roomType && item.ratePlan && <span className="mx-1">•</span>}
                      {item.ratePlan && <span>Rate plan: {item.ratePlan}</span>}
                    </p>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 whitespace-nowrap">
                  {item.date ? String(item.date).slice(0, 16) : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

