"use client"

interface UserAccessOverviewProps {
  totalUsers: number
  propertyManagers: number
  multiPropertyAdmins: number
  restrictedUsers: number
  loading?: boolean
}

export function UserAccessOverview({
  totalUsers,
  propertyManagers,
  multiPropertyAdmins,
  restrictedUsers,
  loading,
}: UserAccessOverviewProps) {
  const show = (v: number) => (loading ? "—" : v)

  return (
    <div className="rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-4 text-white shadow-lg">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/90">
        User Access Overview
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-white/15 p-3">
          <p className="text-xs font-medium text-white/80">Total Users</p>
          <p className="mt-1 text-2xl font-bold">{show(totalUsers)}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <p className="text-xs font-medium text-white/80">Property Managers</p>
          <p className="mt-1 text-2xl font-bold">{show(propertyManagers)}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <p className="text-xs font-medium text-white/80">Multi-Property Admins</p>
          <p className="mt-1 text-2xl font-bold">{show(multiPropertyAdmins)}</p>
        </div>
        <div className="rounded-lg bg-white/15 p-3">
          <p className="text-xs font-medium text-white/80">Restricted Users</p>
          <p className="mt-1 text-2xl font-bold">{show(restrictedUsers)}</p>
        </div>
      </div>
    </div>
  )
}

