'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil } from 'lucide-react'
import ParentSubCategory from './ParentSubCategory'
import CategoryDescription from './CategoryDescription'
import CategoryImageUpload from './CategoryImageUpload'
import CategoryStatusToggle from './CategoryStatusToggle'

export default function EditCategory({ categories = [], category, onUpdate, saving }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [parentId, setParentId] = useState(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    setName(category?.name || '')
    setDescription(category?.description || '')
    setImageUrl(category?.imageUrl || null)
    setParentId(category?.parentId || null)
    setIsActive(category?.isActive !== false)
  }, [category?.id])

  const canSubmit = useMemo(() => Boolean(category?.id) && name.trim().length >= 2, [category?.id, name])

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await onUpdate?.(category.id, {
      name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl || null,
      parentId: parentId || null,
      isActive,
    })
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Pencil className="h-5 w-5 text-violet-600" />
          Edit Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!category?.id ? (
          <p className="text-sm text-slate-500">Select a category to edit.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                required
              />
            </div>

            <ParentSubCategory
              categories={categories.filter((c) => c.id !== category.id)}
              parentId={parentId}
              onParentChange={setParentId}
            />
            <CategoryDescription value={description} onChange={setDescription} />
            <CategoryImageUpload value={imageUrl} onChange={setImageUrl} />
            <CategoryStatusToggle checked={isActive} onCheckedChange={setIsActive} />

            <Button type="submit" disabled={!canSubmit || saving} className="w-full bg-violet-600 hover:bg-violet-700">
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

