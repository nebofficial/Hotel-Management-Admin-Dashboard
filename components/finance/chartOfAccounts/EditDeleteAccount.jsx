'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import AccountTypeSelector from './AccountTypeSelector'
import AccountStatusToggle from './AccountStatusToggle'
import OpeningBalanceSetup from './OpeningBalanceSetup'
import ParentSubAccounts from './ParentSubAccounts'

export default function EditDeleteAccount({ account, accounts, apiBase, onUpdated, onDeleted }) {
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [name, setName] = useState(account?.name ?? '')
  const [accountType, setAccountType] = useState(account?.accountType ?? 'Asset')
  const [parentId, setParentId] = useState(account?.parentId ?? null)
  const [openingBalance, setOpeningBalance] = useState(Number(account?.openingBalance ?? 0))
  const [balanceType, setBalanceType] = useState(account?.balanceType ?? 'Debit')
  const [status, setStatus] = useState(account?.status ?? 'Active')
  const [description, setDescription] = useState(account?.description ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const resetForm = () => {
    setName(account?.name ?? '')
    setAccountType(account?.accountType ?? 'Asset')
    setParentId(account?.parentId ?? null)
    setOpeningBalance(Number(account?.openingBalance ?? 0))
    setBalanceType(account?.balanceType ?? 'Debit')
    setStatus(account?.status ?? 'Active')
    setDescription(account?.description ?? '')
  }

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  const handleSave = async () => {
    if (!account?.id || !apiBase) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/chart-of-accounts/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: name.trim(),
          accountType,
          parentId: parentId || undefined,
          openingBalance,
          balanceType,
          status,
          description: description.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.message || 'Failed to update.')
        return
      }
      onUpdated?.(data.account)
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to update.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!account?.id || !apiBase) return
    setDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/chart-of-accounts/${account.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.message || 'Failed to delete.')
        return
      }
      onDeleted?.(account.id)
      setDeleteOpen(false)
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Failed to delete.')
    } finally {
      setDeleting(false)
    }
  }

  if (!account) return null

  return (
    <>
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleOpen}>
          <Pencil className="h-4 w-4 text-amber-600" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Account — {account.code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-gray-700">Name</Label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" />
            </div>
            <AccountTypeSelector value={accountType} onChange={setAccountType} />
            <ParentSubAccounts accounts={accounts} parentId={parentId} onChange={setParentId} currentId={account.id} />
            <OpeningBalanceSetup amount={openingBalance} balanceType={balanceType} onAmountChange={setOpeningBalance} onBalanceTypeChange={setBalanceType} />
            <AccountStatusToggle value={status} onChange={setStatus} />
            <div>
              <Label className="text-gray-700">Description</Label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              {account.code} — {account.name}. Sub-accounts must be removed or reassigned first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
