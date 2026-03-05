'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import ParentSubCategory from './ParentSubCategory'
import CategoryDescription from './CategoryDescription'
import CategoryImageUpload from './CategoryImageUpload'
import CategoryStatusToggle from './CategoryStatusToggle'

export default function AddCategory({ categories = [], onCreate, creating }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [parentId, setParentId] = useState(null)
  const [isActive, setIsActive] = useState(true)

  const canSubmit = useMemo(() => name.trim().length >= 2, [name])

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    await onCreate?.({
      name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl || null,
      parentId: parentId || null,
      isActive,
    })
    setName('')
    setDescription('')
    setImageUrl(null)
    setParentId(null)
    setIsActive(true)
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <PlusCircle className="h-5 w-5 text-blue-600" />
          Add Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Kitchen Supplies"
              required
            />
            <p className="text-xs text-slate-500">Minimum 2 characters.</p>
          </div>

          <ParentSubCategory categories={categories} parentId={parentId} onParentChange={setParentId} />
          <CategoryDescription value={description} onChange={setDescription} />
          <CategoryImageUpload value={imageUrl} onChange={setImageUrl} />
          <CategoryStatusToggle checked={isActive} onCheckedChange={setIsActive} />

          <Button type="submit" disabled={!canSubmit || creating} className="w-full bg-blue-600 hover:bg-blue-700">
            {creating ? 'Creating…' : 'Create Category'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

