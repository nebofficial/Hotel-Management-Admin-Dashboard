'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { CreditCard, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupplierPaymentTerms({ supplier, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentTerms, setPaymentTerms] = useState('')

  useEffect(() => {
    if (supplier) {
      setPaymentTerms(supplier.paymentTerms || '')
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
        body: JSON.stringify({ paymentTerms }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update payment terms')
      }

      const data = await res.json()
      alert('Payment terms updated successfully')
      if (onUpdate) onUpdate(data.supplier)
    } catch (error) {
      console.error('Update payment terms error:', error)
      alert(error.message || 'Failed to update payment terms')
    } finally {
      setLoading(false)
    }
  }

  const quickTerms = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Advance', 'COD']

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <CreditCard className="h-5 w-5" />
          Payment Terms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-terms" className="text-gray-700">Payment Terms</Label>
            <Input
              id="payment-terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="mt-1"
              placeholder="e.g., Net 30, Advance, COD"
            />
            <p className="text-xs text-gray-500 mt-1">
              Define credit period and payment mode (e.g., Net 30 means payment due in 30 days)
            </p>
          </div>
          <div>
            <Label className="text-gray-700 mb-2 block">Quick Select</Label>
            <div className="flex flex-wrap gap-2">
              {quickTerms.map((term) => (
                <Button
                  key={term}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPaymentTerms(term)}
                  className={paymentTerms === term ? 'bg-orange-100 border-orange-300' : ''}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Payment Terms'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
