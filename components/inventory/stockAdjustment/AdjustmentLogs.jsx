'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { History, Search, ArrowUp, ArrowDown } from 'lucide-react'

const statusColors = { Approved: 'bg-green-100 text-green-800', Pending: 'bg-amber-100 text-amber-800', Rejected: 'bg-red-100 text-red-800' }
const typeLabels = { PHYSICAL_AUDIT: 'Physical Audit', DAMAGE: 'Damage', EXPIRY: 'Expiry', THEFT_LOSS: 'Theft/Loss', MANUAL_CORRECTION: 'Manual' }

export default function AdjustmentLogs({ adjustments, items, searchTerm, onSearch, statusFilter, onStatusFilter, typeFilter, onTypeFilter }) {
  const getItemName = (id) => items?.find((i) => i.id === id)?.name || id

  const filtered = (adjustments || []).filter((a) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      if (!a.adjustmentNumber?.toLowerCase().includes(q) && !getItemName(a.itemId)?.toLowerCase().includes(q)) return false
    }
    if (statusFilter && a.status !== statusFilter) return false
    if (typeFilter && a.adjustmentType !== typeFilter) return false
    return true
  })

  return (
    <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <History className="h-5 w-5" />
          Adjustment Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." value={searchTerm} onChange={(e) => onSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
          <select value={statusFilter} onChange={(e) => onStatusFilter(e.target.value)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={typeFilter} onChange={(e) => onTypeFilter(e.target.value)} className="rounded-xl border border-gray-300 px-3 py-2 text-sm">
            <option value="">All types</option>
            {Object.entries(typeLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Qty</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No adjustments found</td></tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.adjustmentNumber}</td>
                  <td className="px-4 py-3">{getItemName(a.itemId)}</td>
                  <td className="px-4 py-3">{typeLabels[a.adjustmentType] || a.adjustmentType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 font-medium ${Number(a.quantityDelta) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(a.quantityDelta) > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      {a.quantityDelta > 0 ? '+' : ''}{a.quantityDelta}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100'}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{new Date(a.createdAt || a.requestedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
