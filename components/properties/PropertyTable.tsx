"use client"

import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2, UserPlus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PropertyRow {
  id: string
  name: string
  address: string
  phone?: string
  rooms?: number
  status: string
}

interface PropertyTableProps {
  properties: PropertyRow[]
  loading?: boolean
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onAssignManager: (id: string) => void
  canEdit?: boolean
}

export function PropertyTable(props: PropertyTableProps) {
  const { properties, loading, onView, onEdit, onDelete, onAssignManager, canEdit = true } = props
  if (loading) return <div className="flex h-48 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">Loading...</div>
  if (properties.length === 0) return <div className="flex h-48 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700">No properties.</div>
  return (
    <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/80">
      <Table>
        <TableHeader>
          <TableRow className="border-blue-200 bg-blue-100/50">
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((p) => (
            <TableRow key={p.id} className="border-blue-100">
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="max-w-[180px] truncate">{p.address}</TableCell>
              <TableCell>{p.phone || "-"}</TableCell>
              <TableCell>{p.rooms ?? "-"}</TableCell>
              <TableCell>
                <span className={`rounded px-2 py-0.5 text-xs ${p.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>{p.status}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" onClick={() => onView(p.id)} className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                  {canEdit && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => onEdit(p.id)} className="h-8 w-8 p-0"><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => onAssignManager(p.id)} className="h-8 w-8 p-0"><UserPlus className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(p.id)} className="h-8 w-8 p-0 text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
