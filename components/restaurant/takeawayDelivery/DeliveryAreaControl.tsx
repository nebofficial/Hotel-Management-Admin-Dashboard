'use client'

import { useState } from 'react'
import type { DeliveryArea } from './TakeawayDelivery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'

interface Props {
  areas: DeliveryArea[]
  onCreateArea: (p: Partial<DeliveryArea>) => Promise<unknown>
  onUpdateArea: (id: string, p: Partial<DeliveryArea>) => Promise<unknown>
  onDeleteArea: (id: string) => Promise<unknown>
}

export default function DeliveryAreaControl({ areas, onCreateArea, onUpdateArea, onDeleteArea }: Props) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DeliveryArea | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ pincode: '', zoneName: '', isActive: true, notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openCreate = () => { setForm({ pincode: '', zoneName: '', isActive: true, notes: '' }); setEditing(null); setOpen(true); setError(null) }
  const openEdit = (a: DeliveryArea) => { setForm({ pincode: a.pincode || '', zoneName: a.zoneName || '', isActive: a.isActive, notes: a.notes || '' }); setEditing(a); setOpen(true); setError(null) }

  const handleSave = async () => {
    setSaving(true); setError(null)
    try {
      if (editing) await onUpdateArea(editing.id, { pincode: form.pincode.trim() || null, zoneName: form.zoneName.trim() || null, isActive: form.isActive, notes: form.notes.trim() || null })
      else await onCreateArea({ pincode: form.pincode.trim() || null, zoneName: form.zoneName.trim() || null, isActive: form.isActive, notes: form.notes.trim() || null })
      setOpen(false)
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setSaving(true)
    try { await onDeleteArea(deleteId); setDeleteId(null) }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed') }
    finally { setSaving(false) }
  }

  return (
    <Card className="border border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> Delivery Area Control</CardTitle>
        <p className="text-xs text-slate-500">Manage serviceable areas (pincode / zone).</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Area</Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Pincode</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Zone</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-700">Active</th>
                <th className="px-3 py-2 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{a.pincode || '-'}</td>
                  <td className="px-3 py-2">{a.zoneName || '-'}</td>
                  <td className="px-3 py-2"><Badge variant={a.isActive ? 'default' : 'secondary'} className={a.isActive ? 'bg-green-600' : ''}>{a.isActive ? 'Yes' : 'No'}</Badge></td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" size="sm" className="h-7" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 text-red-600" onClick={() => setDeleteId(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {areas.length === 0 && <p className="p-4 text-center text-slate-500 text-xs">No areas.</p>}
        </div>
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} area</DialogTitle></DialogHeader>
          <div className="grid gap-2 py-2">
            <Label>Pincode</Label>
            <Input value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))} />
            <Label>Zone name</Label>
            <Input value={form.zoneName} onChange={(e) => setForm((f) => ({ ...f, zoneName: e.target.value }))} />
            <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /><Label htmlFor="active">Active</Label></div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete area?</AlertDialogTitle>
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
