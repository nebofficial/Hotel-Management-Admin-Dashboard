'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock } from 'lucide-react'
import Link from 'next/link'

export function RecentReportsActivity({ items }) {
  const list = items && items.length ? items : []

  return (
    <Card className="border border-slate-200 shadow-sm rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-slate-800">Recent Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-[11px]">
        {list.length === 0 && (
          <p className="text-slate-500 py-4 text-center">No reports generated yet for this period.</p>
        )}
        {list.map((item) => (
          <Link
            key={item.id}
            href={item.href || '#'}
            className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
          >
            <div className="mt-0.5">
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 leading-snug">{item.title}</p>
              <p className="text-slate-500 leading-snug">
                {item.subtitle}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(item.generatedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

function formatTimestamp(value) {
  if (!value) return 'Just now'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString()
}

