"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { fetchUsers, assignUserToProperty, updateUserRole, fetchUserActivityByProperty } from "@/services/api/userAccessApi"
import { fetchPropertiesList } from "@/services/api/multiPropertyApi"
import { UserAccessHeader } from "./UserAccessHeader"
import { UserAccessOverview } from "./UserAccessOverview"
import { UserSearchFilters } from "./UserSearchFilters"
import { UserAccessTable } from "./UserAccessTable"
import { AssignPropertyModal } from "./AssignPropertyModal"
import { UserActivityByProperty } from "./UserActivityByProperty"

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000"

export default function UserAccessDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({ name: "", propertyId: "", role: "", accessLevel: "" })
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)

  const canEdit = user?.role === "super_admin"

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [uRes, pRes] = await Promise.all([
          fetchUsers(API_BASE),
          fetchPropertiesList(API_BASE),
        ])
        setUsers(uRes.users || [])
        const props = (pRes.properties || []).map((p: any) => ({ id: p.id, name: p.name }))
        setProperties(props)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const derivedUsers = useMemo(() => {
    const mapAccessLevel = (u: any): "full" | "admin" | "limited" => {
      if (u.role === "super_admin") return "full"
      if (u.role === "hotel_admin") return "admin"
      return "limited"
    }
    return (users || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      hotelName: u.hotel?.name,
      accessLevel: mapAccessLevel(u),
      isActive: u.isActive !== false,
      hotelId: u.hotelId,
    }))
  }, [users])

  const filteredUsers = useMemo(() => {
    return derivedUsers.filter((u) => {
      if (filters.name && !u.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      if (filters.propertyId && u.hotelId !== filters.propertyId) return false
      if (filters.role && u.role !== filters.role) return false
      if (filters.accessLevel && u.accessLevel !== filters.accessLevel) return false
      return true
    })
  }, [derivedUsers, filters])

  const overview = useMemo(() => {
    const totalUsers = derivedUsers.length
    const propertyManagers = derivedUsers.filter((u) => u.role === "hotel_admin").length
    const multiPropertyAdmins = derivedUsers.filter((u) => u.role === "super_admin").length
    const restrictedUsers = derivedUsers.filter((u) => !u.isActive).length
    return { totalUsers, propertyManagers, multiPropertyAdmins, restrictedUsers }
  }, [derivedUsers])

  const handleAssignClick = (id: string) => {
    if (!canEdit) return
    setSelectedUserId(id)
    setAssignOpen(true)
  }

  const handleAssignSubmit = async (hotelId: string, role: string) => {
    if (!selectedUserId) return
    await assignUserToProperty(API_BASE, selectedUserId, hotelId)
    await updateUserRole(API_BASE, selectedUserId, role)
    // refresh users
    const res = await fetchUsers(API_BASE)
    setUsers(res.users || [])
  }

  const handleEditRole = (id: string) => {
    // For now, reuse assign modal as role editor
    handleAssignClick(id)
  }

  const handleRestrict = async (id: string) => {
    if (!canEdit) return
    // Simple restrict: set isActive=false for user
    await fetch(`${API_BASE}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isActive: false }),
    })
    const res = await fetchUsers(API_BASE)
    setUsers(res.users || [])
  }

  useEffect(() => {
    const loadActivity = async () => {
      if (!filters.propertyId) {
        setActivityLogs([])
        return
      }
      setActivityLoading(true)
      try {
        const res = await fetchUserActivityByProperty(API_BASE, filters.propertyId, {})
        setActivityLogs(res.logs || [])
      } finally {
        setActivityLoading(false)
      }
    }
    loadActivity()
  }, [filters.propertyId])

  const selectedUserName =
    derivedUsers.find((u) => u.id === selectedUserId)?.name || ""

  return (
    <main className="space-y-6 p-4 md:p-6">
      <UserAccessHeader onGrantAccess={() => handleAssignClick(derivedUsers[0]?.id || "")} />

      <UserAccessOverview
        totalUsers={overview.totalUsers}
        propertyManagers={overview.propertyManagers}
        multiPropertyAdmins={overview.multiPropertyAdmins}
        restrictedUsers={overview.restrictedUsers}
        loading={loading}
      />

      <UserSearchFilters
        name={filters.name}
        propertyId={filters.propertyId}
        role={filters.role}
        accessLevel={filters.accessLevel}
        properties={properties}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
      />

      <UserAccessTable
        users={filteredUsers}
        onAssign={handleAssignClick}
        onEditRole={handleEditRole}
        onRestrict={handleRestrict}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <UserActivityByProperty logs={activityLogs} loading={activityLoading} />
        {/* Simple description panel for cross-property rules */}
        <div className="rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-amber-500 p-4 text-xs text-white shadow-lg">
          <h3 className="mb-2 text-sm font-semibold">Cross-Property Data Restrictions</h3>
          <ul className="list-disc space-y-1 pl-4">
            <li>Staff can see only their assigned property.</li>
            <li>Property Managers can see only the properties they manage.</li>
            <li>Super Admins can see and manage all properties.</li>
          </ul>
        </div>
      </div>

      <AssignPropertyModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        userId={selectedUserId}
        userName={selectedUserName}
        properties={properties}
        onSubmit={handleAssignSubmit}
      />
    </main>
  )
}

