'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { Bell, Loader2, Mail } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function NotificationSystem({ item, onSent }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [channel, setChannel] = useState('SYSTEM')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!item) return
    if (channel === 'EMAIL' && !recipient?.trim()) {
      alert('Email address is required for email notifications')
      return
    }
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`/api/hotel-data//stock-alerts/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ` },
        body: JSON.stringify({ itemId: item.id, channel, recipient: recipient.trim() || undefined }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to send')
      alert('Notification sent successfully')
      if (onSent) onSent()
    } catch (e) {
      alert(e.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  if (!item) return null

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 text-base">
          <Bell className="h-5 w-5" />
          Send Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-blue-900 font-medium">{item.name}</p>
        <div>
          <Label>Notification Channel</Label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm">
            <option value="SYSTEM">System (In-App)</option>
            <option value="EMAIL">Email</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
        {(channel === 'EMAIL' || channel === 'BOTH') && (
          <div>
            <Label>Email Address</Label>
            <Input type="email" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="manager@hotel.com" className="mt-1 rounded-xl" />
          </div>
        )}
        <Button onClick={handleSend} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />} Send Alert
        </Button>
      </CardContent>
    </Card>
  )
}
