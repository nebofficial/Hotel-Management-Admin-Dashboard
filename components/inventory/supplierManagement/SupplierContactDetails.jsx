'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupplierContactDetails({ supplier, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [contactData, setContactData] = useState({
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (supplier) {
      setContactData({
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
      })
    }
  }, [supplier])

  if (!supplier) return null

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${user?.hotelId}/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update contact details')
      }

      const data = await res.json()
      alert('Contact details updated successfully')
      if (onUpdate) onUpdate(data.supplier)
    } catch (error) {
      console.error('Update contact details error:', error)
      alert(error.message || 'Failed to update contact details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Phone className="h-5 w-5" />
          Contact Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="contact-person" className="text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Person
            </Label>
            <Input
              id="contact-person"
              value={contactData.contactPerson}
              onChange={(e) => setContactData({ ...contactData, contactPerson: e.target.value })}
              className="mt-1"
              placeholder="Name of contact person"
            />
          </div>
          <div>
            <Label htmlFor="contact-email" className="text-gray-700 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={contactData.email}
              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              className="mt-1"
              placeholder="supplier@example.com"
            />
          </div>
          <div>
            <Label htmlFor="contact-phone" className="text-gray-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="contact-phone"
              value={contactData.phone}
              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              className="mt-1"
              placeholder="+1-234-567-8900"
            />
          </div>
          <div>
            <Label htmlFor="contact-address" className="text-gray-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Textarea
              id="contact-address"
              value={contactData.address}
              onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
              rows={3}
              className="mt-1"
              placeholder="Full address"
            />
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Contact Details'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
