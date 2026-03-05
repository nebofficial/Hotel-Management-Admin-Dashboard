"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { StaffMemberRecord, StaffRole } from "./StaffAssignment"

interface RoleManagementProps {
  staff: StaffMemberRecord[]
  creating: boolean
  saving: boolean
  onCreate: (payload: {
    name: string
    role: StaffRole
    department?: string
    primaryArea?: string
    roomNo?: string
    floor?: string
    colorTag?: string
  }) => Promise<void> | void
  onUpdate: (
    id: string,
    updates: Partial<{
      name: string
      role: StaffRole
      department: string | null
      primaryArea: string | null
      roomNo: string | null
      floor: string | null
      colorTag: string | null
      isActive: boolean
    }>,
  ) => Promise<void> | void
  onDelete: (id: string) => Promise<void> | void
}

const ROLE_COLORS: Record<StaffRole, string> = {
  Housekeeping: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Laundry: "bg-sky-50 text-sky-700 border-sky-100",
  Inspector: "bg-amber-50 text-amber-700 border-amber-100",
  Supervisor: "bg-purple-50 text-purple-700 border-purple-100",
  Other: "bg-slate-50 text-slate-700 border-slate-100",
}

export function RoleManagement({
  staff,
  creating,
  saving,
  onCreate,
  onUpdate,
  onDelete,
}: RoleManagementProps) {
  const [name, setName] = useState("")
  const [role, setRole] = useState<StaffRole>("Housekeeping")
  const [department, setDepartment] = useState("")
  const [primaryArea, setPrimaryArea] = useState("")
  const [roomNo, setRoomNo] = useState("")
  const [floor, setFloor] = useState("")
  const [editingStaff, setEditingStaff] = useState<StaffMemberRecord | null>(null)
  const [editName, setEditName] = useState("")
  const [editRole, setEditRole] = useState<StaffRole>("Housekeeping")
  const [editDepartment, setEditDepartment] = useState("")
  const [editPrimaryArea, setEditPrimaryArea] = useState("")
  const [editRoomNo, setEditRoomNo] = useState("")
  const [editFloor, setEditFloor] = useState("")

  useEffect(() => {
    if (editingStaff) {
      setEditName(editingStaff.name)
      setEditRole(editingStaff.role)
      setEditDepartment(editingStaff.department ?? "")
      setEditPrimaryArea(editingStaff.primaryArea ?? "")
      setEditRoomNo(editingStaff.roomNo ?? "")
      setEditFloor(editingStaff.floor ?? "")
    }
  }, [editingStaff])

  const canCreate = name.trim().length > 0 && !creating

  const handleSubmit = async () => {
    if (!canCreate) return
    await onCreate({
      name: name.trim(),
      role,
      department: department.trim() || undefined,
      primaryArea: primaryArea.trim() || undefined,
      roomNo: roomNo.trim() || undefined,
      floor: floor.trim() || undefined,
    })
    setName("")
    setDepartment("")
    setPrimaryArea("")
    setRoomNo("")
    setFloor("")
    setRole("Housekeeping")
  }

  const handleSaveEdit = async () => {
    if (!editingStaff || !editName.trim()) return
    await onUpdate(editingStaff.id, {
      name: editName.trim(),
      role: editRole,
      department: editDepartment.trim() || null,
      primaryArea: editPrimaryArea.trim() || null,
      roomNo: editRoomNo.trim() || null,
      floor: editFloor.trim() || null,
    })
    setEditingStaff(null)
  }

  const groupedByRole = useMemo(() => {
    const map: Record<StaffRole, StaffMemberRecord[]> = {
      Housekeeping: [],
      Laundry: [],
      Inspector: [],
      Supervisor: [],
      Other: [],
    }
    staff.forEach((s) => {
      map[s.role].push(s)
    })
    return map
  }, [staff])

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="rounded-2xl bg-linear-to-r from-purple-600 via-fuchsia-500 to-rose-500 text-white shadow-sm border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Team composition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-[11px] space-y-1">
            <p className="opacity-90">
              Quickly see how many staff members you have in each role for
              better shift planning.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(Object.keys(groupedByRole) as StaffRole[]).map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] flex items-center gap-1"
                >
                  <span className="font-medium">{r}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
                    {groupedByRole[r].length}
                  </span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-white shadow-sm border border-slate-100 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Add staff member
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-slate-600 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Singh"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Role
                </label>
                <select
                title="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffRole)}
                  className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2"
                >
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Department / section
                </label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Guest floors, Public areas"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Primary area / zone
                </label>
                <Input
                  value={primaryArea}
                  onChange={(e) => setPrimaryArea(e.target.value)}
                  placeholder="e.g. Floors 1-3, Suites"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Room no
                </label>
                <Input
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="e.g. 101, 202"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">
                  Floor
                </label>
                <Input
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. 1, 2, Ground"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700"
                disabled={!canCreate}
                onClick={handleSubmit}
              >
                {creating ? "Adding..." : "Add staff"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl bg-white shadow-sm border border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Staff directory
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[11px] text-slate-500 border-b border-slate-100">
                  <th className="py-2 px-2 text-left font-medium">Name</th>
                  <th className="py-2 px-2 text-left font-medium">Role</th>
                  <th className="py-2 px-2 text-left font-medium hidden md:table-cell">
                    Department
                  </th>
                  <th className="py-2 px-2 text-left font-medium hidden md:table-cell">
                    Primary area
                  </th>
                  <th className="py-2 px-2 text-left font-medium">Room no</th>
                  <th className="py-2 px-2 text-left font-medium">Floor</th>
                  <th className="py-2 px-2 text-left font-medium">Status</th>
                  <th className="py-2 px-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-4 px-2 text-[11px] text-slate-500 text-center"
                    >
                      No staff members configured yet. Add your housekeeping,
                      laundry, and inspection team to get started.
                    </td>
                  </tr>
                )}
                {staff.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-2 px-2 text-slate-900 font-medium">
                      {s.name}
                    </td>
                    <td className="py-2 px-2">
                      <Badge
                        className={`border text-[10px] font-medium ${ROLE_COLORS[s.role]}`}
                      >
                        {s.role}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 hidden md:table-cell text-slate-600">
                      {s.department || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2 px-2 hidden md:table-cell text-slate-600">
                      {s.primaryArea || (
                        <span className="text-slate-400">Not set</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-slate-600">
                      {s.roomNo || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2 px-2 text-slate-600">
                      {s.floor || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="py-2 px-2">
                      <Badge
                        className={`text-[10px] ${
                          s.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-slate-200 text-slate-600 text-[10px]"
                          disabled={saving}
                          onClick={() => setEditingStaff(s)}
                          title="Edit staff"
                        >
                          ✎
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-slate-200 text-[10px]"
                          disabled={saving}
                          onClick={() =>
                            onUpdate(s.id, { isActive: !s.isActive })
                          }
                          title={s.isActive ? "Deactivate" : "Activate"}
                        >
                          {s.isActive ? "⏸" : "▶"}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-rose-200 text-rose-600 text-[10px]"
                          disabled={saving}
                          onClick={() => onDelete(s.id)}
                          title="Delete staff"
                        >
                          ✕
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit staff member</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Staff name"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Role</label>
              <select
                title="Role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as StaffRole)}
                className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2"
              >
                <option value="Housekeeping">Housekeeping</option>
                <option value="Laundry">Laundry</option>
                <option value="Inspector">Inspector</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Room no</label>
                <Input
                  value={editRoomNo}
                  onChange={(e) => setEditRoomNo(e.target.value)}
                  placeholder="e.g. 101"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Floor</label>
                <Input
                  value={editFloor}
                  onChange={(e) => setEditFloor(e.target.value)}
                  placeholder="e.g. 1, Ground"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Department / section</label>
              <Input
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                placeholder="Optional"
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Primary area / zone</label>
              <Input
                value={editPrimaryArea}
                onChange={(e) => setEditPrimaryArea(e.target.value)}
                placeholder="Optional"
                className="h-8 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setEditingStaff(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                disabled={!editName.trim() || saving}
                onClick={handleSaveEdit}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

