'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, BookOpen, Plus, X } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function RecipeMapping({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipe, setRecipe] = useState<{ ingredients: string[]; instructions: string[] }>({
    ingredients: [],
    instructions: [],
  })
  const [newIngredient, setNewIngredient] = useState("")
  const [newInstruction, setNewInstruction] = useState("")

  const handleOpen = (item: MenuItem) => {
    setEditingItem(item)
    setRecipe(
      item.recipeMapping || {
        ingredients: [],
        instructions: [],
      },
    )
    setNewIngredient("")
    setNewInstruction("")
  }

  const handleSave = async () => {
    if (!editingItem || !user?.hotelId) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${editingItem.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipeMapping: recipe }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update recipe (HTTP ${res.status})`,
        )
      }

      setEditingItem(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update recipe")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Items with recipes
            </div>
            <div className="text-lg font-semibold">
              {items.filter((i) => i.recipeMapping).length}
            </div>
          </div>
          <BookOpen className="h-8 w-8 opacity-80" />
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
            Recipe mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage recipes for.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                    {item.recipeMapping ? (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.recipeMapping.ingredients?.length || 0} ingredients,{" "}
                        {item.recipeMapping.instructions?.length || 0} steps
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        No recipe mapped
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs ml-3"
                    onClick={() => handleOpen(item)}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    {item.recipeMapping ? "Edit" : "Add"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <DialogHeader>
              <DialogTitle>Recipe: {editingItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Ingredients
                </div>
                {recipe.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50"
                  >
                    <span className="text-xs text-slate-700">{ing}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 border-rose-200 text-rose-600"
                      onClick={() =>
                        setRecipe({
                          ...recipe,
                          ingredients: recipe.ingredients.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Add ingredient"
                    className="h-7 text-xs flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newIngredient.trim()) {
                        setRecipe({
                          ...recipe,
                          ingredients: [...recipe.ingredients, newIngredient.trim()],
                        })
                        setNewIngredient("")
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-teal-600 hover:bg-teal-700"
                    onClick={() => {
                      if (newIngredient.trim()) {
                        setRecipe({
                          ...recipe,
                          ingredients: [...recipe.ingredients, newIngredient.trim()],
                        })
                        setNewIngredient("")
                      }
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">
                  Instructions
                </div>
                {recipe.instructions.map((inst, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-2 rounded border border-slate-200 bg-slate-50"
                  >
                    <span className="text-xs text-slate-700 flex-1">
                      {idx + 1}. {inst}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-5 w-5 border-rose-200 text-rose-600 ml-2"
                      onClick={() =>
                        setRecipe({
                          ...recipe,
                          instructions: recipe.instructions.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    placeholder="Add instruction step"
                    className="h-7 text-xs flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newInstruction.trim()) {
                        setRecipe({
                          ...recipe,
                          instructions: [...recipe.instructions, newInstruction.trim()],
                        })
                        setNewInstruction("")
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-teal-600 hover:bg-teal-700"
                    onClick={() => {
                      if (newInstruction.trim()) {
                        setRecipe({
                          ...recipe,
                          instructions: [...recipe.instructions, newInstruction.trim()],
                        })
                        setNewInstruction("")
                      }
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-teal-600 hover:bg-teal-700"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
