'use client'

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'textarea' | 'date'
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface FormBuilderProps {
  title: string
  description: string
  fields: FormField[]
  onSubmit?: (data: Record<string, string>) => void
  submitText?: string
  backLink?: string
  isEditing?: boolean
}

export function FormBuilder({
  title,
  description,
  fields,
  onSubmit,
  submitText = 'Save',
  backLink = '/',
  isEditing = false,
}: FormBuilderProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    onSubmit?.(data as Record<string, string>)
  }

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
          <Link href={backLink}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-900">
                    {field.label}
                    {field.required && <span className="text-red-600 ml-1">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 resize-none"
                      rows={3}
                    />
                  ) : field.type === 'select' && field.options ? (
                    <select
                      name={field.name}
                      required={field.required}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <Button type="submit" className="h-8 text-xs bg-red-600 hover:bg-red-700">
                  {submitText}
                </Button>
                <Link href={backLink}>
                  <Button type="button" variant="outline" className="h-8 text-xs bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
