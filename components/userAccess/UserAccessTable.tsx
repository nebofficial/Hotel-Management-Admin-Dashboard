"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  hotelName?: string
  accessLevel: "full" | "admin" | "limited"
  isActive: boolean
}

interface UserAccessTableProps {
  users: UserRow[]
  onAssign: (userId: string) => void
  onEditRole: (userId: string) => void
  onRestrict: (userId: string) => void
}

export function UserAccessTable({ users, onAssign, onEditRole, onRestrict }: UserAccessTableProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-4 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/95">
        User Access Management
      </h3>
      <div className="overflow-x-auto rounded-lg bg-white/5">
        <table className="min-w-full text-xs text-white">
          <thead>
            <tr className="border-b border-white/20 bg-white/10">
              <th className="px-3 py-2 text-left font-semibold">User</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Assigned Property</th>
              <th className="px-3 py-2 text-left font-semibold">Role</th>
              <th className="px-3 py-2 text-left font-semibold">Access Level</th>
              <th className="px-3 py-2 text-center font-semibold">Status</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/10 hover:bg-white/10">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-white/80">{u.email}</td>
                <td className="px-3 py-2 text-white/90">{u.hotelName || "—"}</td>
                <td className="px-3 py-2 text-white/90">{u.role}</td>
                <td className="px-3 py-2">
                  <Badge variant="outline" className="border-white/40 text-[10px] capitalize">
                    {u.accessLevel}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                      u.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" className="h-7 border-white/40 text-[10px]" onClick={() => onAssign(u.id)}>
                      Assign
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-white/40 text-[10px]" onClick={() => onEditRole(u.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-red-300 text-[10px] text-red-100" onClick={() => onRestrict(u.id)}>
                      Restrict
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

