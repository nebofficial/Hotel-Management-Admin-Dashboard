'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import ItemUnitSelection from './ItemUnitSelection'
import PricingDetails from './PricingDetails'
import ItemExpiryDate from './ItemExpiryDate'
import BatchManagement from './BatchManagement'
import ItemImageUpload from './ItemImageUpload'
import SKUBarcodeGeneration from './SKUBarcodeGeneration'

export default function AddNewItem({ categories = [], suppliers = [], onCreate, creating }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('')
  const [currentStock, setCurrentStock] = useState(0)
  const [reorderLevel, setReorderLevel] = useState(0)
  const [costPrice, setCostPrice] = useState(0)
  const [sellingPrice, setSellingPrice] = useState(0)
  const [supplierId, setSupplierId] = useState('')
  const [location, setLocation] = useState('')
  const [expiryDate, setExpiryDate] = useState(null)
  const [batchNumber, setBatchNumber] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [notes, setNotes] = useState('')
  const [sku, setSku] = useState('')
  const [barcode, setBarcode] = useState('')

  const canSubmit = useMemo(() => name.trim().length >= 2 && unit, [name, unit])

  const generateCodes = () => {
    if (!sku) {
      const prefix = name.substring(0, 3).toUpperCase()
      const timestamp = Date.now().toString().slice(-6)
      setSku(`${prefix}-${timestamp}`)
    }
    if (!barcode) {
      setBarcode(`BC${Date.now()}${Math.floor(Math.random() * 1000)}`)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await onCreate?.({
      name: name.trim(),
      category: category || null,
      unit: unit || null,
      currentStock: Number(currentStock) || 0,
      reorderLevel: Number(reorderLevel) || 0,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      supplierId: supplierId || null,
      location: location.trim() || null,
      expiryDate: expiryDate || null,
      batchNumber: batchNumber.trim() || null,
      imageUrl: imageUrl || null,
      notes: notes.trim() || null,
      sku: sku.trim() || null,
      barcode: barcode.trim() || null,
    })
    setName('')
    setCategory('')
    setUnit('')
    setCurrentStock(0)
    setReorderLevel(0)
    setCostPrice(0)
    setSellingPrice(0)
    setSupplierId('')
    setLocation('')
    setExpiryDate(null)
    setBatchNumber('')
    setImageUrl(null)
    setNotes('')
    setSku('')
    setBarcode('')
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <PlusCircle className="h-5 w-5 text-blue-600" />
          Add New Stock Item
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="item-name">Item Name *</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!sku && e.target.value.length >= 3) generateCodes()
              }}
              placeholder="e.g., Premium Tea"
              required
            />
          </div>

          <SKUBarcodeGeneration
            name={name}
            sku={sku}
            barcode={barcode}
            onSKUChange={setSku}
            onBarcodeChange={setBarcode}
            onGenerate={generateCodes}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-category">Category</Label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select category…</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat} value={typeof cat === 'string' ? cat : cat.name}>
                    {typeof cat === 'string' ? cat : cat.name}
                  </option>
                ))}
              </select>
            </div>
            <ItemUnitSelection value={unit} onChange={setUnit} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input
                id="current-stock"
                type="number"
                min="0"
                step="0.01"
                value={currentStock}
                onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reorder-level">Reorder Level</Label>
              <Input
                id="reorder-level"
                type="number"
                min="0"
                step="0.01"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <PricingDetails
            costPrice={costPrice}
            sellingPrice={sellingPrice}
            onCostChange={setCostPrice}
            onSellingChange={setSellingPrice}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="supplier">Supplier</Label>
              <select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select supplier…</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Warehouse A"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ItemExpiryDate value={expiryDate} onChange={setExpiryDate} />
            <BatchManagement batchNumber={batchNumber} onBatchChange={setBatchNumber} />
          </div>

          <ItemImageUpload value={imageUrl} onChange={setImageUrl} />

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes…"
              className="min-h-[60px]"
            />
          </div>

          <Button type="submit" disabled={!canSubmit || creating} className="w-full bg-blue-600 hover:bg-blue-700">
            {creating ? 'Creating…' : 'Create Stock Item'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
