'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package } from 'lucide-react'

export default function ProductSpecificOffers({ rules, onSave, loading, products = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    productIds: [],
    discountType: 'percent',
    discountValue: 15,
    startTime: '17:00',
    endTime: '19:00',
  })

  const handleProductToggle = (productId) => {
    setFormData({
      ...formData,
      productIds: formData.productIds.includes(productId)
        ? formData.productIds.filter((id) => id !== productId)
        : [...formData.productIds, productId],
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.productIds.length === 0) {
      alert('Please select at least one product')
      return
    }
    onSave({
      ...formData,
      daysOfWeek: [],
      weekendOnly: false,
      barOnly: false,
      autoRevert: true,
      autoActivate: true,
      autoDeactivate: true,
      isActive: true,
    })
    setFormData({
      name: '',
      productIds: [],
      discountType: 'percent',
      discountValue: 15,
      startTime: '17:00',
      endTime: '19:00',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4" />
          Product-Specific Offers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Offer Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Beer Special"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <select
              id="discountType"
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <Label htmlFor="discountValue">
              Discount Value {formData.discountType === 'percent' ? '(%)' : '(₹)'}
            </Label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              step={formData.discountType === 'percent' ? '1' : '0.01'}
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div>
            <Label>Select Products</Label>
            <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
              {products.length === 0 ? (
                <p className="text-xs text-gray-500 py-2">No products available</p>
              ) : (
                products.map((product) => (
                  <label
                    key={product.id}
                    className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.productIds.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="rounded"
                    />
                    <span className="text-xs">{product.name || product.id}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.productIds.length} product(s)
            </p>
          </div>

          <Button type="submit" disabled={loading || formData.productIds.length === 0} className="w-full">
            {loading ? 'Creating...' : 'Create Product-Specific Offer'}
          </Button>
        </form>

        {rules && rules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Active Product-Specific Rules</h4>
            <div className="space-y-1 text-xs">
              {rules
                .filter((r) => r.productIds && r.productIds.length > 0)
                .map((rule) => (
                  <div key={rule.id} className="flex justify-between border-b pb-1">
                    <span className="font-medium">{rule.name}</span>
                    <span className="text-gray-600">
                      {rule.productIds.length} product(s) - {rule.discountValue}
                      {rule.discountType === 'percent' ? '%' : '₹'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
