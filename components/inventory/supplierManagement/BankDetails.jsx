'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { Building2, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function BankDetails({ supplier, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [bankData, setBankData] = useState({
    bankName: '',
    bankAccountNumber: '',
    bankIFSC: '',
    bankBranch: '',
  })

  useEffect(() => {
    if (supplier) {
      setBankData({
        bankName: supplier.bankName || '',
        bankAccountNumber: supplier.bankAccountNumber || '',
        bankIFSC: supplier.bankIFSC || '',
        bankBranch: supplier.bankBranch || '',
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
        body: JSON.stringify(bankData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update bank details')
      }

      const data = await res.json()
      alert('Bank details updated successfully')
      if (onUpdate) onUpdate(data.supplier)
    } catch (error) {
      console.error('Update bank details error:', error)
      alert(error.message || 'Failed to update bank details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-900">
          <Building2 className="h-5 w-5" />
          Bank Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="bank-name" className="text-gray-700">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankData.bankName}
              onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
              className="mt-1"
              placeholder="Bank name"
            />
          </div>
          <div>
            <Label htmlFor="account-number" className="text-gray-700">Account Number</Label>
            <Input
              id="account-number"
              value={bankData.bankAccountNumber}
              onChange={(e) => setBankData({ ...bankData, bankAccountNumber: e.target.value })}
              className="mt-1"
              placeholder="Account number"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ifsc" className="text-gray-700">IFSC Code</Label>
              <Input
                id="ifsc"
                value={bankData.bankIFSC}
                onChange={(e) => setBankData({ ...bankData, bankIFSC: e.target.value.toUpperCase() })}
                className="mt-1"
                placeholder="IFSC code"
                maxLength={11}
              />
            </div>
            <div>
              <Label htmlFor="branch" className="text-gray-700">Branch</Label>
              <Input
                id="branch"
                value={bankData.bankBranch}
                onChange={(e) => setBankData({ ...bankData, bankBranch: e.target.value })}
                className="mt-1"
                placeholder="Branch name"
              />
            </div>
          </div>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Bank Details'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
