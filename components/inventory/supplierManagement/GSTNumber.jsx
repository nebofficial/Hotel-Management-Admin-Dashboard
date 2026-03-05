'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function GSTNumber({ supplier, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [gstNumber, setGstNumber] = useState('')
  const [isValid, setIsValid] = useState(null)

  useEffect(() => {
    if (supplier) {
      setGstNumber(supplier.gstNumber || '')
    }
  }, [supplier])

  if (!supplier) return null

  const validateGST = (gst) => {
    if (!gst) {
      setIsValid(null)
      return
    }
    // Basic GST validation: 15 characters, alphanumeric
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    const isValidFormat = gstRegex.test(gst.toUpperCase())
    setIsValid(isValidFormat)
    return isValidFormat
  }

  const handleUpdate = async () => {
    if (gstNumber && !validateGST(gstNumber)) {
      alert('Invalid GST number format. Please enter a valid 15-character GST number.')
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
        body: JSON.stringify({ gstNumber: gstNumber.toUpperCase() }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update GST number')
      }

      const data = await res.json()
      alert('GST number updated successfully')
      if (onUpdate) onUpdate(data.supplier)
    } catch (error) {
      console.error('Update GST error:', error)
      alert(error.message || 'Failed to update GST number')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-900">
          <FileText className="h-5 w-5" />
          GST Number
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gst-number" className="text-gray-700">GST Registration Number</Label>
            <div className="relative mt-1">
              <Input
                id="gst-number"
                value={gstNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase()
                  setGstNumber(value)
                  validateGST(value)
                }}
                placeholder="15-character GST number"
                maxLength={15}
                className={isValid === false ? 'border-red-300' : isValid === true ? 'border-green-300' : ''}
              />
              {gstNumber && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValid === true ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : isValid === false ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : null}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: 15 characters (e.g., 27ABCDE1234F1Z5)
            </p>
            {isValid === false && (
              <p className="text-xs text-red-600 mt-1">Invalid GST number format</p>
            )}
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading || (gstNumber && isValid === false)}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update GST Number'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
