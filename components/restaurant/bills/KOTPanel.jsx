'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChefHat } from 'lucide-react'

export default function KOTPanel({ kot, onGenerate }) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-violet-50/80 to-purple-50/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          Kitchen Order Ticket
        </h3>
        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            className="text-xs px-2 py-1 rounded bg-violet-600 text-white hover:bg-violet-700"
          >
            Generate KOT
          </button>
        )}
      </CardHeader>
      <CardContent className="p-2 pt-0">
        {kot ? (
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
            <div className="font-semibold text-slate-800">#{kot.kotNumber}</div>
            <div className="text-xs text-slate-500 mt-1">Table: {kot.tableNo}</div>
            <div className="mt-2 space-y-1">
              {(kot.items || []).map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{i.name} × {i.quantity}</span>
                  <span className="text-slate-500">{i.status || 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-500">
            KOT will appear here when generated
          </div>
        )}
      </CardContent>
    </Card>
  )
}
