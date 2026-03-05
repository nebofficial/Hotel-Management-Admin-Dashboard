'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Image as ImageIcon } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function ImageUpload({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")

  const handleUpdateImage = async (itemId: string) => {
    if (!user?.hotelId || !imageUrl.trim()) return

    setUploading(itemId)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${itemId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: imageUrl.trim() }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update image (HTTP ${res.status})`,
        )
      }

      setImageUrl("")
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update image")
    } finally {
      setUploading(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Items with images
            </div>
            <div className="text-lg font-semibold">
              {items.filter((i) => i.imageUrl).length} / {items.length}
            </div>
          </div>
          <ImageIcon className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Image URLs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage images for.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="text-sm font-medium text-slate-900">
                    {item.name}
                  </div>
                  {item.imageUrl && (
                    <div className="w-full h-24 rounded border border-slate-200 overflow-hidden bg-slate-100">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      value={item.id === uploading ? imageUrl : item.imageUrl || ""}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="h-8 text-xs flex-1"
                      disabled={uploading === item.id}
                    />
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setImageUrl(item.imageUrl || "")
                        handleUpdateImage(item.id)
                      }}
                      disabled={uploading === item.id || !imageUrl.trim()}
                    >
                      {uploading === item.id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
