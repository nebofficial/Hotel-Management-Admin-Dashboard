'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StatusBadge from './StatusBadge'
import ReservationActions from './ReservationActions'

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}

function diffNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return '—'
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '—'
  const ms = b.getTime() - a.getTime()
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export default function ReservationTable({ reservations, loading, onEdit, onCancel, onPrint }) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-white text-sm">Reservations</CardTitle>
          <div className="text-xs text-sky-100/90">
            All reservations with quick actions for modify, cancel, and print voucher.
          </div>
        </div>
        <div className="text-xs text-sky-100/80">
          Total: <span className="font-semibold">{reservations.length}</span>
        </div>
      </CardHeader>
      <CardContent className="bg-white/5 backdrop-blur-sm rounded-t-2xl p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-full text-xs">
            <TableHeader>
              <TableRow className="bg-white/10 border-b border-sky-200/30">
                <TableHead className="text-sky-50">Reservation #</TableHead>
                <TableHead className="text-sky-50">Guest</TableHead>
                <TableHead className="text-sky-50">Phone</TableHead>
                <TableHead className="text-sky-50">Room</TableHead>
                <TableHead className="text-sky-50">Check-in</TableHead>
                <TableHead className="text-sky-50">Check-out</TableHead>
                <TableHead className="text-sky-50 text-right">Nights</TableHead>
                <TableHead className="text-sky-50 text-right">Total</TableHead>
                <TableHead className="text-sky-50">Status</TableHead>
                <TableHead className="text-sky-50 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-sky-100">
                    Loading reservations…
                  </TableCell>
                </TableRow>
              ) : reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-sky-100">
                    No reservations found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((r) => (
                  <TableRow key={r.id} className="border-b border-sky-200/20 hover:bg-white/5">
                    <TableCell className="font-semibold text-white">
                      {r.bookingNumber || '—'}
                    </TableCell>
                    <TableCell className="text-sky-50">{r.guestName || '—'}</TableCell>
                    <TableCell className="text-sky-50">{r.guestPhone || '—'}</TableCell>
                    <TableCell className="text-sky-50">
                      {r.roomNumber || '—'} {r.roomType ? `• ${r.roomType}` : ''}
                    </TableCell>
                    <TableCell className="text-sky-50">{formatDate(r.checkIn)}</TableCell>
                    <TableCell className="text-sky-50">{formatDate(r.checkOut)}</TableCell>
                    <TableCell className="text-right text-sky-50">
                      {diffNights(r.checkIn, r.checkOut)}
                    </TableCell>
                    <TableCell className="text-right text-sky-50">
                      {typeof r.totalAmount !== 'undefined' ? Number(r.totalAmount).toFixed(2) : '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} isNoShow={r.isNoShow} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ReservationActions
                        reservation={r}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onPrint={onPrint}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

