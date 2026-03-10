'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { RolesHeader } from './RolesHeader'
import { RolesStatsCards } from './RolesStatsCards'
import { RolesSearchBar } from './RolesSearchBar'
import { RolesFilters } from './RolesFilters'
import { RoleListTable } from './RoleListTable'
import { RolePermissionsPanel } from './RolePermissionsPanel'
import { CreateRoleModal } from './CreateRoleModal'
import { EditRoleModal } from './EditRoleModal'
import { PermissionAuditLog } from './PermissionAuditLog'
import { RolesExportButton } from './RolesExportButton'
import { RolesPagination } from './RolesPagination'
import { assignPermissions, createRole, fetchPermissionLogs, fetchRoles, updateRole } from '@/services/api/rolesPermissionsApi'
import { Button } from '@/components/ui/button'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export default function RolesPermissionsPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [roles, setRoles] = useState([])
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [permissionsSaving, setPermissionsSaving] = useState(false)
  const [permissionsError, setPermissionsError] = useState(null)
  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  const load = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const [rolesRes, logsRes] = await Promise.all([fetchRoles(apiBase), fetchPermissionLogs(apiBase)])
      const newRoles = rolesRes.roles || []
      setRoles(newRoles)
      setLogs(logsRes.logs || [])
      if (selectedRole?.id) {
        const updated = newRoles.find((r) => r.id === selectedRole.id)
        if (updated) setSelectedRole(updated)
      }
    } catch (err) {
      console.error('RolesPermissions load error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const filteredRoles = useMemo(() => {
    let list = roles
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) => String(r.name || '').toLowerCase().includes(q))
    }
    if (filters.module && filters.module !== 'All Modules') {
      list = list.filter((r) => (r.permissions || []).some((p) => String(p).startsWith(`${filters.module}:`)))
    }
    const start = (page - 1) * pageSize
    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
    }
  }, [roles, search, filters, page, pageSize])

  const handleCreateRole = async ({ name, description }) => {
    if (!apiBase) return
    await createRole(apiBase, { name, description })
    await load()
  }

  const handleUpdateRole = async (roleId, payload) => {
    if (!apiBase) return
    await updateRole(apiBase, roleId, payload)
    await load()
  }

  const handlePermissionsChange = async (matrix) => {
    if (!apiBase || !selectedRole?.id) return
    setPermissionsError(null)
    setPermissionsSaving(true)
    try {
      await assignPermissions(apiBase, selectedRole.id, matrix)
      await load()
    } catch (err) {
      console.error('Assign permissions error:', err)
      setPermissionsError(err?.message || 'Failed to save permissions')
    } finally {
      setPermissionsSaving(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to manage roles and permissions.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <RolesHeader onCreate={() => setCreateOpen(true)} />

      <RolesStatsCards roles={roles} staffCount={user ? 1 : 0} />

      <div className="flex items-center justify-between gap-2">
        <RolesSearchBar value={search} onChange={setSearch} />
        <RolesExportButton apiBase={apiBase} />
      </div>

      <RolesFilters filters={filters} onChange={setFilters} />

      <div className="grid gap-4 lg:grid-cols-[2fr,1.4fr]">
        <div className="space-y-3">
          <RoleListTable
            roles={filteredRoles.list}
            loading={loading}
            onEdit={(r) => {
              setSelectedRole(r)
              setEditOpen(true)
            }}
            onSelect={setSelectedRole}
          />
          <RolesPagination page={page} pageSize={pageSize} total={filteredRoles.total} onChange={setPage} />
        </div>
        <div className="space-y-3">
          <RolePermissionsPanel
            role={selectedRole}
            onChange={handlePermissionsChange}
            saving={permissionsSaving}
            error={permissionsError}
          />
          <div className="flex justify-end">
            <Button asChild type="button" size="sm" variant="outline" className="h-8 text-xs">
              <Link href="/staff/assign-role">Assign Role to Staff</Link>
            </Button>
          </div>
          <PermissionAuditLog logs={logs} />
        </div>
      </div>

      <CreateRoleModal open={createOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateRole} />
      <EditRoleModal open={editOpen} onOpenChange={setEditOpen} role={selectedRole} onSubmit={handleUpdateRole} />
    </div>
  )
}

