"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/app/auth-context"
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  fetchPropertyProfile,
  assignPropertyManager,
  fetchUsers,
} from "@/services/api/propertyApi"
import { fetchPropertyStats } from "@/services/api/multiPropertyApi"
import { PropertyHeader } from "./PropertyHeader"
import { PropertyOverviewCards } from "./PropertyOverviewCards"
import { PropertyFilters } from "./PropertyFilters"
import { PropertyTable } from "./PropertyTable"
import { AddPropertyModal, type AddPropertyForm } from "./AddPropertyModal"
import { EditPropertyModal } from "./EditPropertyModal"
import { PropertyProfile } from "./PropertyProfile"
import { AssignPropertyManager } from "./AssignPropertyManager"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000"

export default function PropertyListDashboard() {
  const { user } = useAuth()
  const [hotels, setHotels] = useState<any[]>([])
  const [stats, setStats] = useState({ totalProperties: 0, totalRooms: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])

  const canEdit = user?.role === "super_admin"

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [hotelsRes, statsRes] = await Promise.all([
        fetchProperties(API_BASE),
        fetchPropertyStats(API_BASE),
      ])
      setHotels(hotelsRes.hotels || [])
      setStats({
        totalProperties: statsRes.totalProperties || 0,
        totalRooms: statsRes.totalRooms || 0,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (assignOpen && canEdit) {
      fetchUsers(API_BASE).then((r) => setUsers(r.users || [])).catch(() => setUsers([]))
    }
  }, [assignOpen, canEdit])

  const filtered = hotels.filter((h) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !(h.name || "").toLowerCase().includes(q) &&
        !(h.address || "").toLowerCase().includes(q)
      )
        return false
    }
    if (statusFilter === "Active" && !h.isActive) return false
    if (statusFilter === "Inactive" && h.isActive) return false
    return true
  })

  const tableRows = filtered.map((h) => ({
    id: h.id,
    name: h.name,
    address: h.address,
    phone: h.phone,
    rooms: undefined,
    status: h.isActive ? "Active" : "Inactive",
  }))

  const activeCount = hotels.filter((h) => h.isActive).length

  const handleAdd = async (data: AddPropertyForm) => {
    await createProperty(API_BASE, data)
    load()
  }

  const handleEdit = async (id: string, data: { name: string; address: string; phone: string; email: string }) => {
    await updateProperty(API_BASE, id, data)
    load()
  }

  const handleDelete = async () => {
    if (!selectedId) return
    await deleteProperty(API_BASE, selectedId)
    setDeleteOpen(false)
    setSelectedId(null)
    load()
  }

  const handleView = async (id: string) => {
    setProfileLoading(true)
    setProfileOpen(true)
    setProfile(null)
    try {
      const res = await fetchPropertyProfile(API_BASE, id)
      setProfile(res)
    } catch (e) {
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAssign = async (propertyId: string, userId: string) => {
    await assignPropertyManager(API_BASE, propertyId, userId)
    setAssignOpen(false)
    setSelectedId(null)
    load()
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <PropertyHeader onAddProperty={() => setAddOpen(true)} canAdd={canEdit} />
      <PropertyOverviewCards
        totalProperties={stats.totalProperties}
        activeProperties={activeCount}
        inactiveProperties={stats.totalProperties - activeCount}
        totalRooms={stats.totalRooms}
        loading={loading}
      />
      <PropertyFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onReset={() => {
          setSearch("")
          setStatusFilter("all")
        }}
      />
      <PropertyTable
        properties={tableRows}
        loading={loading}
        onView={handleView}
        onEdit={(id) => {
          setSelectedId(id)
          setEditOpen(true)
        }}
        onDelete={(id) => {
          setSelectedId(id)
          setDeleteOpen(true)
        }}
        onAssignManager={(id) => {
          setSelectedId(id)
          setAssignOpen(true)
        }}
        canEdit={canEdit}
      />
      <AddPropertyModal open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} />
      <EditPropertyModal
        open={editOpen}
        onOpenChange={setEditOpen}
        property={selectedId ? hotels.find((h) => h.id === selectedId) || null : null}
        onSubmit={handleEdit}
      />
      <PropertyProfile
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={profile}
        loading={profileLoading}
      />
      <AssignPropertyManager
        open={assignOpen}
        onOpenChange={setAssignOpen}
        propertyId={selectedId}
        propertyName={hotels.find((h) => h.id === selectedId)?.name || ""}
        users={users}
        onSubmit={handleAssign}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the property and its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
