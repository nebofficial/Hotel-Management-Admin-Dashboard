'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { Star, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupplierRating({ supplier, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    if (supplier) {
      setRating(supplier.rating || 0)
    }
  }, [supplier])

  if (!supplier) return null

  const handleUpdate = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${user?.hotelId}/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update rating')
      }

      const data = await res.json()
      alert('Rating updated successfully')
      if (onUpdate) onUpdate(data.supplier)
    } catch (error) {
      console.error('Update rating error:', error)
      alert(error.message || 'Failed to update rating')
    } finally {
      setLoading(false)
    }
  }

  const getRatingLabel = (value) => {
    const labels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent',
    }
    return labels[value] || ''
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-900">
          <Star className="h-5 w-5" />
          Supplier Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-700 mb-3 block">Rate Supplier Performance</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      value <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">{rating}/5</span> - {getRatingLabel(rating)}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Current Rating:</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-600">
                  {supplier.rating ? Number(supplier.rating).toFixed(1) : 'N/A'}
                </span>
                {supplier.rating && (
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-4 w-4 ${
                          value <= Number(supplier.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading || rating === 0}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Rating'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
