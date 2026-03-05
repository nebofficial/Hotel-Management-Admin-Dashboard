'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { FileText, Loader2, CheckCircle2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function CreateGRNFromPO({ purchaseOrders, onGRNCreated }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPOId, setSelectedPOId] = useState('')
  const [selectedPO, setSelectedPO] = useState(null)

  useEffect(() => {
    if (selectedPOId && purchaseOrders) {
      const po = purchaseOrders.find((p) => p.id === selectedPOId)
      setSelectedPO(po || null)
    } else {
      setSelectedPO(null)
    }
  }, [selectedPOId, purchaseOrders])

  const handleCreateGRN = async () => {
    if (!selectedPOId) {
      alert('Please select a Purchase Order')
      return
    }

    if (!selectedPO) {
      alert('Purchase Order not found')
      return
    }

    if (selectedPO.status !== 'Approved' && selectedPO.status !== 'Ordered') {
      alert('Can only create GRN from Approved or Ordered Purchase Orders')
      return
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      
      // Initialize received items from PO items
      const receivedItems = Array.isArray(selectedPO.items) ? selectedPO.items.map((item) => ({
        itemId: item.itemId || item.id,
        itemName: item.name || item.itemName,
        orderedQty: Number(item.quantity || 0),
        receivedQty: Number(item.quantity || 0),
        acceptedQty: 0,
        rejectedQty: 0,
        damagedQty: 0,
        unitPrice: Number(item.unitPrice || item.price || 0),
        batchNumber: '',
        expiryDate: null,
        condition: 'Good',
        notes: '',
      })) : []

      const res = await fetch(`${API_BASE}/api/hotel-data/${user?.hotelId}/grns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          purchaseOrderId: selectedPOId,
          receivedItems,
          notes: `GRN created from PO ${selectedPO.orderNumber}`,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to create GRN' }))
        throw new Error(errorData.message || 'Failed to create GRN')
      }

      const data = await res.json()
      alert('GRN created successfully')
      setSelectedPOId('')
      setSelectedPO(null)
      if (onGRNCreated) onGRNCreated(data.grn)
    } catch (error) {
      console.error('Create GRN error:', error)
      alert(error.message || 'Failed to create GRN')
    } finally {
      setLoading(false)
    }
  }

  const approvedPOs = purchaseOrders?.filter(
    (po) => po.status === 'Approved' || po.status === 'Ordered'
  ) || []

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <FileText className="h-5 w-5" />
          Create GRN from Purchase Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="po-select" className="text-gray-700">Select Purchase Order</Label>
            <Select value={selectedPOId} onValueChange={setSelectedPOId}>
              <SelectTrigger id="po-select" className="mt-1">
                <SelectValue placeholder="Choose a Purchase Order" />
              </SelectTrigger>
              <SelectContent>
                {approvedPOs.length === 0 ? (
                  <SelectItem value="none" disabled>No approved POs available</SelectItem>
                ) : (
                  approvedPOs.map((po) => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.orderNumber} - {po.status} - {new Date(po.orderDate).toLocaleDateString()}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedPO && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-gray-900">PO Details</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">PO Number:</span> {selectedPO.orderNumber}</p>
                <p><span className="font-medium">Supplier:</span> {selectedPO.supplierId}</p>
                <p><span className="font-medium">Items:</span> {Array.isArray(selectedPO.items) ? selectedPO.items.length : 0}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{Number(selectedPO.totalAmount || 0).toFixed(2)}</p>
              </div>
            </div>
          )}

          <Button
            onClick={handleCreateGRN}
            disabled={loading || !selectedPOId || approvedPOs.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating GRN...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Create GRN
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
