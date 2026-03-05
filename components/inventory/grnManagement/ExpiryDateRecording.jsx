'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { Calendar, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ExpiryDateRecording({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (grn && Array.isArray(grn.receivedItems)) {
      setItems(grn.receivedItems.map((item) => ({
        ...item,
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
      })))
    }
  }, [grn])

  if (!grn) return null

  const handleExpiryChange = (index, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      expiryDate: value,
    }
    setItems(newItems)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      
      // Convert date strings back to Date objects for API
      const itemsToSave = items.map((item) => ({
        ...item,
        expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString() : null,
      }))
      
      const res = await fetch(`${API_BASE}/api/hotel-data/${user?.hotelId}/grns/${grn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receivedItems: itemsToSave,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update GRN' }))
        throw new Error(errorData.message || 'Failed to update GRN')
      }

      const data = await res.json()
      alert('Expiry dates saved successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Update expiry dates error:', error)
      alert(error.message || 'Failed to update expiry dates')
    } finally {
      setLoading(false)
    }
  }

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900">
          <Calendar className="h-5 w-5" />
          Expiry Date Recording
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate)
            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0
            const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0
            
            return (
              <div key={index} className={`bg-white rounded-lg p-4 border ${
                isExpired ? 'border-red-300 bg-red-50' :
                isExpiringSoon ? 'border-yellow-300 bg-yellow-50' :
                'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                  {daysUntilExpiry !== null && (
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      isExpired ? 'bg-red-100 text-red-700' :
                      isExpiringSoon ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {isExpired ? 'Expired' : isExpiringSoon ? `${daysUntilExpiry} days left` : `${daysUntilExpiry} days left`}
                    </span>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Expiry Date</Label>
                  <Input
                    type="date"
                    value={item.expiryDate || ''}
                    onChange={(e) => handleExpiryChange(index, e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )
          })}

          <Button
            onClick={handleSave}
            disabled={loading || items.length === 0}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Save Expiry Dates
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
