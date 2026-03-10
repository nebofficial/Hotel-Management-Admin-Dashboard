'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { assignRoleToStaff, fetchRoles } from '@/services/api/rolesPermissionsApi'

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

export default function AssignRolePage() {
  const { user, hotel } = useAuth()
  const router = useRouter()
  const effectiveHotelId = user?.hotelId || hotel?.id

  const [roles, setRoles] = useState([])
  const [staffId, setStaffId] = useState('')
  const [roleId, setRoleId] = useState('')
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const apiBase = useMemo(
    () => (effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ''),
    [effectiveHotelId],
  )

  useEffect(() => {
    if (!apiBase) return
    const load = async () => {
      setLoadingRoles(true)
      try {
        const res = await fetchRoles(apiBase)
        setRoles(res.roles || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load roles')
      } finally {
        setLoadingRoles(false)
      }
    }
    load()
  }, [apiBase])

  const handleAssign = async () => {
    if (!apiBase || !staffId || !roleId) return
    setAssigning(true)
    setMessage(null)
    setError(null)
    try {
      await assignRoleToStaff(apiBase, { staffId, roleId })
      setMessage('Role assigned successfully.')
      // Optionally redirect back after a short delay
      // setTimeout(() => router.push('/staff/roles-permissions'), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign role')
    } finally {
      setAssigning(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 text-sm">Select a hotel to assign roles to staff.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4 min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/25 to-violet-50/25">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Assign Role to Staff</h2>
          <p className="text-xs text-slate-600 mt-1">
            Enter a staff ID and select a role to assign role-based access.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() => router.push('/staff/roles-permissions')}
        >
          Back to Roles
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {message}
        </div>
      )}

      <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-900">Role Assignment</CardTitle>
        </CardHeader>
        <CardContent className="pt-1 space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Staff ID</Label>
            <Input
              className="h-8 text-xs max-w-xs"
              placeholder="Enter staff user ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
          <div className="space-y-1 max-w-xs">
            <Label className="text-[11px]">Role</Label>
            <Select value={roleId} onValueChange={setRoleId} disabled={loadingRoles}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder={loadingRoles ? 'Loading roles…' : 'Select role'} />
              </SelectTrigger>
              <SelectContent>
                {(roles || []).map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs"
              disabled={assigning || !staffId || !roleId}
              onClick={handleAssign}
            >
              {assigning ? 'Assigning…' : 'Assign Role'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

