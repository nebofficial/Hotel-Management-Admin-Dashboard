'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FormBuilder } from "@/components/form-builder"
import { useAuth } from "@/app/auth-context"
import { createStaffMember } from "@/services/api/staffApi"

function getApiBaseUrl() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}

const STAFF_ROLES = [
  { label: "Housekeeping", value: "Housekeeping" },
  { label: "Laundry", value: "Laundry" },
  { label: "Inspector", value: "Inspector" },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Other", value: "Other" },
]

export default function CreateStaffPage() {
  const router = useRouter()
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ""

  const [error, setError] = useState<string | null>(null)

  const fields = [
    { name: "name", label: "Full Name", type: "text", required: true, placeholder: "e.g. John Smith" },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: false,
      options: STAFF_ROLES,
    },
    { name: "department", label: "Department", type: "text", required: false, placeholder: "e.g. Housekeeping" },
    { name: "primaryArea", label: "Primary Area", type: "text", required: false, placeholder: "e.g. Floors 1-3" },
  ]

  const handleSubmit = async (data: Record<string, string>) => {
    if (!apiBase) {
      setError("No hotel selected")
      return
    }
    setError(null)
    try {
      await createStaffMember(apiBase, {
        name: data.name?.trim() || "",
        role: data.role || undefined,
        department: data.department?.trim() || undefined,
        primaryArea: data.primaryArea?.trim() || undefined,
      })
      router.push("/staff/list")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add staff")
    }
  }

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <p className="text-gray-600">Select a hotel to add staff.</p>
      </main>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="mx-4 p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {error}
        </div>
      )}
      <FormBuilder
        title="Add New Staff Member"
        description="Register a new employee"
        fields={fields}
        submitText="Add Staff"
        backLink="/staff/list"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
