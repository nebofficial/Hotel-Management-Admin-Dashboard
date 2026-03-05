'use client'

import { forwardRef } from 'react'

const RegistrationCardPrint = forwardRef(function RegistrationCardPrint({ card, hotelName }, ref) {
  const c = card || {}

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div ref={ref} className="p-8 bg-white text-black min-h-[600px] font-sans">
      <div className="border-2 border-black p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide">{hotelName || 'Hotel Name'}</h1>
          <p className="text-sm text-gray-600">Guest Registration Card</p>
        </div>

        <div className="border-t border-b border-gray-300 py-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Walk-in No:</span>
              <span className="ml-2 font-semibold">{c.walkinNumber || '—'}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-semibold">{formatDate(c.generatedAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-xs mb-1">Guest Name</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{c.guestName || '—'}</div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-1">Phone</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{c.guestPhone || '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-xs mb-1">Email</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{c.guestEmail || '—'}</div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-1">No. of Guests</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{c.numberOfGuests || 1}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-xs mb-1">ID Proof Type</label>
              <div className="border-b border-gray-400 pb-1 font-medium capitalize">
                {c.idProofType?.replace('_', ' ') || '—'}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-1">ID Number</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{c.idProofNumber || '—'}</div>
            </div>
          </div>

          <div className="bg-gray-100 p-3 rounded mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-xs mb-1">Room Number</label>
                <div className="text-xl font-bold">{c.roomNumber || '—'}</div>
              </div>
              <div>
                <label className="block text-gray-600 text-xs mb-1">Room Type</label>
                <div className="font-medium">{c.roomType || '—'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 text-xs mb-1">Check-in Date</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{formatDate(c.checkIn)}</div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-1">Check-in Time</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{formatTime(c.checkIn)}</div>
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-1">Expected Check-out</label>
              <div className="border-b border-gray-400 pb-1 font-medium">{formatDate(c.expectedCheckOut)}</div>
            </div>
          </div>

          {c.specialRequests && (
            <div className="mt-4">
              <label className="block text-gray-600 text-xs mb-1">Special Requests</label>
              <div className="border border-gray-300 p-2 rounded text-sm min-h-[40px]">
                {c.specialRequests}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-600 mb-8">Guest Signature</p>
              <div className="border-b border-black"></div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-8">Front Desk</p>
              <div className="border-b border-black"></div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Thank you for staying with us!</p>
        </div>
      </div>
    </div>
  )
})

export default RegistrationCardPrint
