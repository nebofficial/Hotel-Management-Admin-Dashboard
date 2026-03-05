'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'
import ItemUnitSelection from './ItemUnitSelection'
import PricingDetails from './PricingDetails'
import ItemExpiryDate from './ItemExpiryDate'
import BatchManagement from './BatchManagement'
import ItemImageUpload from './ItemImageUpload'
import SKUBarcodeGeneration from './SKUBarcodeGeneration'

export default function EditItemDetails({
  categories = [],
  suppliers = [],
  item,
  onUpdate,
  saving,
}) {
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

  useEffect(() => {
    if (item?.id) {
      setName(item.name || '')
      setCategory(item.category || '')
      setUnit(item.unit || '')
      setCurrentStock(Number(item.currentStock || 0))
      setReorderLevel(Number(item.reorderLevel || 0))
      setCostPrice(Number(item.costPrice || 0))
      setSellingPrice(Number(item.sellingPrice || 0))
      setSupplierId(item.supplierId || '')
      setLocation(item.location || '')
      setExpiryDate(item.expiryDate || null)
      setBatchNumber(item.batchNumber || '')
      setImageUrl(item.imageUrl || null)
      setNotes(item.notes || '')
      setSku(item.sku || '')
      setBarcode(item.barcode || '')
    }
  }, [item?.id])

  const canSubmit = useMemo(() => Boolean(item?.id) && name.trim().length >= 2 && unit, [item?.id, name, unit])

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await onUpdate?.(item.id, {
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
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Pencil className="h-5 w-5 text-violet-600" />
          Edit Item Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!item?.id ? (
          <p className="text-sm text-slate-500">Select an item to edit.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-item-name">Item Name *</Label>
              <Input
                id="edit-item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
                required
              />
            </div>

            <SKUBarcodeGeneration
              name={name}
              sku={sku}
              barcode={barcode}
              onSKUChange={setSku}
              onBarcodeChange={setBarcode}
              onGenerate={() => {}}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400"
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
                <Label htmlFor="edit-current-stock">Current Stock</Label>
                <Input
                  id="edit-current-stock"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-reorder-level">Reorder Level</Label>
                <Input
                  id="edit-reorder-level"
                  type="number"
                  min="0"
                  step="0.01"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(parseFloat(e.target.value) || 0)}
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
                <Label htmlFor="edit-supplier">Supplier</Label>
                <select
                  id="edit-supplier"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400"
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
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ItemExpiryDate value={expiryDate} onChange={setExpiryDate} />
              <BatchManagement batchNumber={batchNumber} onBatchChange={setBatchNumber} />
            </div>

            <ItemImageUpload value={imageUrl} onChange={setImageUrl} />

            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes"
                className="min-h-[60px]"
              />
            </div>

            <Button type="submit" disabled={!canSubmit || saving} className="w-full bg-violet-600 hover:bg-violet-700">
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
