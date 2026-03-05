'use client'

import { useState } from 'react'
import type { DeliveryPartner, TakeawayDeliveryOrder } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Bike, Pencil, Plus, Trash2 } from 'lucide-react'

interface Props {
  partners: DeliveryPartner[]
  orders: TakeawayDeliveryOrder[]
  onUpdateOrder: (id: string, patch: Partial<TakeawayDeliveryOrder>) => Promise<unknown>
  onCreatePartner: (payload: Partial<DeliveryPartner>) => Promise<unknown>
  onUpdatePartner: (id: string, patch: Partial<DeliveryPartner>) => Promise<unknown>
  onDeletePartner: (id: string) => Promise<unknown>
}

export default function DeliveryPartnerAssignment(props: Props) {
  const { partners, orders, onUpdateOrder, onCreatePartner, onUpdatePartner, onDeletePartner } = props
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<DeliveryPartner | null>(null)
  const [assignOrderId, setAssignOrderId] = useState<string | null>(null)
  const [assignPartnerId, setAssignPartnerId] = useState('')
  const [partnerForm, setPartnerForm] = useState({ name: '', phone: '', isAvailable: true, notes: '' })
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreate = () => {
    setPartnerForm({ name: '', phone: '', isAvailable: true, notes: '' })
    setCreating(true)
    setError(null)
  }

  const openEdit = (p: DeliveryPartner) => {
    setPartnerForm({ name: p.name, phone: p.phone || '', isAvailable: p.isAvailable, notes: p.notes || '' })
    setEditing(p)
    setError(null)
  }

  const handleSavePartner = async () => {
    if (!partnerForm.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        await onUpdatePartner(editing.id, { name: partnerForm.name.trim(), phone: partnerForm.phone.trim() || null, isAvailable: partnerForm.isAvailable, notes: partnerForm.notes.trim() || null })
        setEditing(null)
      } else {
        await onCreatePartner({ name: partnerForm.name.trim(), phone: partnerForm.phone.trim() || null, isAvailable: partnerForm.isAvailable, notes: partnerForm.notes.trim() || null })
        setCreating(false)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save partner')
    } finally {
      setSaving(false)
    }
  }

  const handleAssign = async () => {
    if (!assignOrderId || !assignPartnerId) return
    setSaving(true)
    setError(null)
    try {
      await onUpdateOrder(assignOrderId, { deliveryPartnerId: assignPartnerId })
      setAssignOrderId(null)
      setAssignPartnerId('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to assign partner')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setSaving(true)
    try {
      await onDeletePartner(deleteId)
      setDeleteId(null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete partner')
    } finally {
      setSaving(false)
    }
  }

  const deliveryOrders = orders.filter((o) => o.orderType === 'Delivery' && o.status !== 'Cancelled')

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Bike className="h-4 w-4" /> Delivery Partner Assignment</CardTitle>
        <p className="text-xs text-slate-500">Assign rider to orders and track availability.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Partner</Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Partners</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Phone</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Availability</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{p.name}</td>
                    <td className="px-3 py-2">{p.phone || '-'}</td>
                    <td className="px-3 py-2">
                      <Badge variant={p.isAvailable ? 'default' : 'secondary'} className={p.isAvailable ? 'bg-green-600' : ''}>
                        {p.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button variant="ghost" size="sm" className="h-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 text-red-600" onClick={() => setDeleteId(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {partners.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No delivery partners. Add one above.</p>}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Assign to order</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Tracking ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Customer</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Assigned Partner</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {deliveryOrders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{o.trackingId}</td>
                    <td className="px-3 py-2">{o.customerName || o.customerPhone || '-'}</td>
                    <td className="px-3 py-2">{o.status}</td>
                    <td className="px-3 py-2">{o.deliveryPartnerId ? partners.find((x) => x.id === o.deliveryPartnerId)?.name ?? o.deliveryPartnerId : '-'}</td>
                    <td className="px-3 py-2 text-right">
                      <Button size="sm" variant="outline" className="h-7" onClick={() => { setAssignOrderId(o.id); setAssignPartnerId(o.deliveryPartnerId || ''); }}>Assign</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {deliveryOrders.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No delivery orders.</p>}
          </div>
        </div>
      </CardContent>
      <Dialog open={creating || !!editing} onOpenChange={(o) => { if (!o) { setCreating(false); setEditing(null); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Partner' : 'Add Delivery Partner'}</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Name *</Label>
            <Input value={partnerForm.name} onChange={(e) => setPartnerForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" />
            <Label>Phone</Label>
            <Input value={partnerForm.phone} onChange={(e) => setPartnerForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="avail" checked={partnerForm.isAvailable} onChange={(e) => setPartnerForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
              <Label htmlFor="avail">Available</Label>
            </div>
            <Label>Notes</Label>
            <Input value={partnerForm.notes} onChange={(e) => setPartnerForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Notes" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={handleSavePartner} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!assignOrderId} onOpenChange={(o) => !o && setAssignOrderId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign delivery partner</DialogTitle></DialogHeader>
          <div className="py-2">
            <Label>Partner</Label>
            <Select value={assignPartnerId} onValueChange={setAssignPartnerId}>
              <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
              <SelectContent>
                {partners.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} {p.isAvailable ? '(Available)' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOrderId(null)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={saving || !assignPartnerId}>{saving ? 'Saving…' : 'Assign'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete delivery partner?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
