"use client"

import { useEffect, useMemo, useState } from "react"
import { MessageSquare, Star, AlertTriangle, Send, User, ClipboardList } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "Submit guest feedback",
  "Rating system (1–5 stars)",
  "Complaint registration",
  "Assign complaint to staff",
  "Track complaint status (Open / In Progress / Resolved)",
  "Maintain complaint resolution history",
]

interface FeedbackRow {
  id: string
  guestName: string
  rating: number
  comment: string
  createdAt: string
}

type ComplaintStatus = "Open" | "In Progress" | "Resolved"

interface ComplaintRow {
  id: string
  guestName: string
  description: string
  assignedTo: string
  status: ComplaintStatus
  resolutionNotes: string
  createdAt: string
  updatedAt: string
}

function StatusBadge({ status }: { status: ComplaintStatus }) {
  if (status === "Resolved") {
    return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
  }
  if (status === "In Progress") {
    return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
  }
  return <Badge className="bg-red-100 text-red-800">Open</Badge>
}

export default function FeedbackPage() {
  const { user } = useAuth()

  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [complaints, setComplaints] = useState<ComplaintRow[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [openComplaints, setOpenComplaints] = useState(0)

  const [feedbackForm, setFeedbackForm] = useState({
    guestName: "",
    rating: "",
    comment: "",
  })
  const [complaintForm, setComplaintForm] = useState({
    guestName: "",
    description: "",
  })

  const [savingFeedback, setSavingFeedback] = useState(false)
  const [savingComplaint, setSavingComplaint] = useState(false)
  const [savingComplaintId, setSavingComplaintId] = useState<string | null>(null)

  const canSubmitFeedback = useMemo(() => {
    const ratingNum = parseInt(feedbackForm.rating, 10)
    return (
      feedbackForm.guestName.trim().length > 0 &&
      Number.isFinite(ratingNum) &&
      ratingNum >= 1 &&
      ratingNum <= 5
    )
  }, [feedbackForm])

  const canSubmitComplaint = useMemo(() => {
    return (
      complaintForm.guestName.trim().length > 0 &&
      complaintForm.description.trim().length > 0
    )
  }, [complaintForm])

  const recalcStats = (feedbackRows: FeedbackRow[], complaintRows: ComplaintRow[]) => {
    const total = feedbackRows.length
    const sum = feedbackRows.reduce((acc, f) => acc + Number(f.rating || 0), 0)
    setTotalReviews(total)
    setAvgRating(total > 0 ? sum / total : 0)
    setOpenComplaints(complaintRows.filter((c) => c.status === "Open").length)
  }

  const fetchAll = async () => {
    if (!user?.hotelId) {
      setLoading(false)
      setFeedback([])
      setComplaints([])
      setError("No hotel associated with your account.")
      return
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setLoading(false)
      setError("Not authenticated. Please log in again.")
      return
    }

    setLoading(true)
    setError(null)

    const feedbackReq = fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/feedback`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(async (r) => {
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to load feedback (${r.status})`)
      }
      return r.json()
    })

    const complaintsReq = fetch(
      `${API_BASE}/api/hotel-data/${user.hotelId}/complaints`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(async (r) => {
      if (!r.ok) {
        const data = await r.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to load complaints (${r.status})`)
      }
      return r.json()
    })

    try {
      const results = await Promise.allSettled([feedbackReq, complaintsReq])
      const [fbRes, compRes] = results

      let fbRows: FeedbackRow[] = []
      let compRows: ComplaintRow[] = []

      if (fbRes.status === "fulfilled") {
        const list = fbRes.value.feedback || []
        fbRows = list.map((row: any) => ({
          id: String(row.id),
          guestName: row.guestName || "—",
          rating: Number(row.rating || 0),
          comment: row.comment || "",
          createdAt: row.createdAt || row.updatedAt || "",
        }))
        setFeedback(fbRows)
      } else {
        console.error(fbRes.reason)
        setFeedback([])
        setError(
          fbRes.reason instanceof Error
            ? fbRes.reason.message
            : "Failed to load feedback."
        )
      }

      if (compRes.status === "fulfilled") {
        const list = compRes.value.complaints || []
        compRows = list.map((row: any) => ({
          id: String(row.id),
          guestName: row.guestName || "—",
          description: row.description || "",
          assignedTo: row.assignedTo || "Unassigned",
          status: (row.status as ComplaintStatus) || "Open",
          resolutionNotes: row.resolutionNotes || "",
          createdAt: row.createdAt || "",
          updatedAt: row.updatedAt || row.createdAt || "",
        }))
        setComplaints(compRows)
      } else {
        console.error(compRes.reason)
        setComplaints([])
        setError((prev) =>
          prev ||
          (compRes.reason instanceof Error
            ? compRes.reason.message
            : "Failed to load complaints.")
        )
      }

      recalcStats(fbRows, compRows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.hotelId])

  const submitFeedback = async () => {
    if (!user?.hotelId) {
      setError("Hotel is not selected. Please log in again or choose a hotel.")
      return
    }
    if (!canSubmitFeedback) {
      setError("Please enter guest name and rating between 1 and 5.")
      return
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingFeedback(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/feedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: feedbackForm.guestName.trim(),
          rating: parseInt(feedbackForm.rating, 10),
          comment: feedbackForm.comment.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to submit feedback (${res.status})`)
      }
      const data = await res.json()
      const row = data.feedback
      const newRow: FeedbackRow = {
        id: String(row.id),
        guestName: row.guestName || feedbackForm.guestName.trim(),
        rating: Number(row.rating || feedbackForm.rating),
        comment: row.comment || feedbackForm.comment.trim(),
        createdAt: row.createdAt || new Date().toISOString(),
      }
      setFeedback((prev) => {
        const updated = [newRow, ...prev]
        recalcStats(updated, complaints)
        return updated
      })
      setFeedbackForm({ guestName: "", rating: "", comment: "" })
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to submit feedback. Please try again."
      )
    } finally {
      setSavingFeedback(false)
    }
  }

  const submitComplaint = async () => {
    if (!user?.hotelId) {
      setError("Hotel is not selected. Please log in again or choose a hotel.")
      return
    }
    if (!canSubmitComplaint) {
      setError("Please enter guest name and complaint description.")
      return
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingComplaint(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/complaints`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName: complaintForm.guestName.trim(),
          description: complaintForm.description.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to register complaint (${res.status})`)
      }
      const data = await res.json()
      const row = data.complaint
      const newRow: ComplaintRow = {
        id: String(row.id),
        guestName: row.guestName || complaintForm.guestName.trim(),
        description: row.description || complaintForm.description.trim(),
        assignedTo: row.assignedTo || "Unassigned",
        status: (row.status as ComplaintStatus) || "Open",
        resolutionNotes: row.resolutionNotes || "",
        createdAt: row.createdAt || new Date().toISOString(),
        updatedAt: row.updatedAt || row.createdAt || new Date().toISOString(),
      }
      setComplaints((prev) => {
        const updated = [newRow, ...prev]
        recalcStats(feedback, updated)
        return updated
      })
      setComplaintForm({ guestName: "", description: "" })
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to register complaint. Please try again."
      )
    } finally {
      setSavingComplaint(false)
    }
  }

  const assignComplaint = async (row: ComplaintRow, assignedTo: string) => {
    if (!user?.hotelId || !assignedTo.trim()) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingComplaintId(row.id)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/complaints/${row.id}/assign`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assignedTo: assignedTo.trim() }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data?.message || `Failed to assign complaint (${res.status})`
        )
      }
      await res.json()
      await fetchAll()
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error ? e.message : "Failed to assign complaint. Please try again."
      )
    } finally {
      setSavingComplaintId(null)
    }
  }

  const updateComplaintStatus = async (
    row: ComplaintRow,
    status: ComplaintStatus,
    resolutionNotes?: string
  ) => {
    if (!user?.hotelId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      return
    }
    setSavingComplaintId(row.id)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/complaints/${row.id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            resolutionNotes: resolutionNotes ?? row.resolutionNotes,
          }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          data?.message || `Failed to update complaint status (${res.status})`
        )
      }
      await res.json()
      await fetchAll()
    } catch (e) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to update complaint status. Please try again."
      )
    } finally {
      setSavingComplaintId(null)
    }
  }

  return (
    <main className="p-4 space-y-6">
      <GuestSectionHeader
        icon={MessageSquare}
        title="Feedback / Complaints"
        description="Submit and view guest feedback (1–5 star ratings), register complaints, assign to staff, and track status (Open / In Progress / Resolved) with resolution history."
      />

      <Accordion
        type="single"
        collapsible
        className="border border-gray-200 rounded-lg bg-gray-50/50"
      >
        <AccordionItem value="sub-features" className="border-b-0 px-4">
          <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
            Sub-features
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 list-disc list-inside">
              {SUB_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-0 shadow-md bg-linear-to-br from-emerald-500 via-emerald-400 to-teal-500 text-white">
          <CardContent className="p-4">
            <p className="text-xs opacity-90 flex items-center gap-1">
              <Star className="h-3.5 w-3.5" /> Avg rating
            </p>
            <p className="mt-1 text-2xl font-bold">
              {avgRating.toFixed(1)} <span className="text-sm opacity-90">/ 5</span>
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-linear-to-br from-sky-500 via-sky-400 to-cyan-500 text-white">
          <CardContent className="p-4">
            <p className="text-xs opacity-90 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> Total reviews
            </p>
            <p className="mt-1 text-2xl font-bold">
              {totalReviews}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-linear-to-br from-rose-500 via-rose-400 to-orange-500 text-white">
          <CardContent className="p-4">
            <p className="text-xs opacity-90 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Open complaints
            </p>
            <p className="mt-1 text-2xl font-bold">
              {openComplaints}
            </p>
          </CardContent>
        </Card>
        </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="feedback">Guest feedback (ratings)</TabsTrigger>
          <TabsTrigger value="complaints">Complaints &amp; resolution history</TabsTrigger>
        </TabsList>
        <TabsContent value="feedback" className="space-y-4">
          <Card className="border border-emerald-100 shadow-sm bg-emerald-50/40">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Send className="h-4 w-4 text-emerald-600" />
                Submit guest feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="fb-guest">Guest name</Label>
                  <Input
                    id="fb-guest"
                    placeholder="Enter guest name"
                    value={feedbackForm.guestName}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({ ...prev, guestName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="fb-rating">Rating (1–5)</Label>
                  <Input
                    id="fb-rating"
                    type="number"
                    min={1}
                    max={5}
                    value={feedbackForm.rating}
                    onChange={(e) =>
                      setFeedbackForm((prev) => ({ ...prev, rating: e.target.value }))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700"
                    disabled={!canSubmitFeedback || savingFeedback || loading}
                    onClick={submitFeedback}
                  >
                    {savingFeedback ? "Saving..." : "Submit feedback"}
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="fb-comment">Comment</Label>
                <Textarea
                  id="fb-comment"
                  rows={3}
                  placeholder="Share feedback about the stay, service, food, etc."
                  value={feedbackForm.comment}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Feedback (1–5 stars)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Loading feedback…</p>
              ) : feedback.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  No feedback submitted yet. Use the form above to add the first review.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white/80">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Guest
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Rating
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Comment
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedback.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50/60"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">
                            {row.guestName}
                          </td>
                          <td className="px-3 py-2 text-amber-600 font-medium">
                            {"★".repeat(Math.round(row.rating)).padEnd(5, "☆")} ({row.rating})
                          </td>
                          <td className="px-3 py-2 text-gray-600 max-w-[260px]">
                            {row.comment || "—"}
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {row.createdAt
                              ? new Date(row.createdAt).toISOString().slice(0, 10)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <Card className="border border-rose-100 shadow-sm bg-rose-50/50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-rose-600" />
                Register complaint
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="cp-guest">Guest name</Label>
                  <Input
                    id="cp-guest"
                    placeholder="Enter guest name"
                    value={complaintForm.guestName}
                    onChange={(e) =>
                      setComplaintForm((prev) => ({ ...prev, guestName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="cp-desc">Complaint description</Label>
                  <Textarea
                    id="cp-desc"
                    rows={2}
                    placeholder="Describe the issue clearly (e.g. AC not cooling, noisy floor, housekeeping delay)…"
                    value={complaintForm.description}
                    onChange={(e) =>
                      setComplaintForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-rose-600 hover:bg-rose-700"
                  disabled={!canSubmitComplaint || savingComplaint || loading}
                  onClick={submitComplaint}
                >
                  {savingComplaint ? "Saving..." : "Register complaint"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Complaints — assign to staff, track status, resolution history
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Loading complaints…</p>
              ) : complaints.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  No complaints registered yet. Use the form above to log an issue.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white/80">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Guest
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Issue
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Assigned to
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Resolution notes
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Last update
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">
                          Actions
                        </th>
              </tr>
            </thead>
            <tbody>
                      {complaints.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 hover:bg-gray-50/60 align-top"
                        >
                          <td className="px-3 py-2 font-medium text-gray-900">
                            {row.guestName}
                          </td>
                          <td className="px-3 py-2 text-gray-600 max-w-[220px]">
                            {row.description}
                          </td>
                          <td className="px-3 py-2 text-gray-600 min-w-[140px]">
                            <div className="flex items-center gap-1 mb-1">
                              <User className="h-3.5 w-3.5 text-gray-500" />
                              <span>{row.assignedTo || "Unassigned"}</span>
                            </div>
                            <Input
                              placeholder="Assign staff"
                              className="h-8 text-xs mt-1"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  const value = (e.target as HTMLInputElement).value
                                  if (value.trim()) {
                                    assignComplaint(row, value)
                                    ;(e.target as HTMLInputElement).value = ""
                                  }
                                }
                              }}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <StatusBadge status={row.status} />
                            <div className="mt-2 flex flex-col gap-1">
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={savingComplaintId === row.id}
                                onClick={() => updateComplaintStatus(row, "Open")}
                              >
                                Open
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={savingComplaintId === row.id}
                                onClick={() =>
                                  updateComplaintStatus(row, "In Progress")
                                }
                              >
                                In Progress
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                disabled={savingComplaintId === row.id}
                                onClick={() =>
                                  updateComplaintStatus(row, "Resolved", row.resolutionNotes)
                                }
                              >
                                Resolved
                              </Button>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 min-w-[220px]">
                            <Textarea
                              rows={3}
                              className="text-xs"
                              value={row.resolutionNotes}
                              onChange={(e) => {
                                const value = e.target.value
                                setComplaints((prev) =>
                                  prev.map((c) =>
                                    c.id === row.id ? { ...c, resolutionNotes: value } : c
                                  )
                                )
                              }}
                              onBlur={() =>
                                updateComplaintStatus(row, row.status, row.resolutionNotes)
                              }
                            />
                          </td>
                          <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                            {row.updatedAt
                              ? new Date(row.updatedAt).toISOString().slice(0, 16).replace("T", " ")
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap">
                            <Button
                              size="xs"
                              variant="ghost"
                              disabled={savingComplaintId === row.id}
                              onClick={() =>
                                updateComplaintStatus(row, "Resolved", row.resolutionNotes)
                              }
                            >
                              Mark resolved
                            </Button>
                          </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

