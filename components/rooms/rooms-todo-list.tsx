"use client"

import { useState } from "react"
import Link from "next/link"
import { ListTodo, Check, Circle, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export interface RoomsTodoItem {
  id: string
  label: string
  href?: string
  priority?: "high" | "medium" | "low"
  done: boolean
}

const defaultTodos: RoomsTodoItem[] = [
  { id: "1", label: "Review room types and pricing", href: "/rooms/types", priority: "high", done: false },
  { id: "2", label: "Update floor-wise status", href: "/rooms/floors", priority: "medium", done: false },
  { id: "3", label: "Assign housekeeping for today", href: "/rooms/housekeeping", priority: "high", done: false },
  { id: "4", label: "Check maintenance requests", href: "/rooms/maintenance", priority: "medium", done: false },
  { id: "5", label: "Update amenities list", href: "/rooms/amenities", priority: "low", done: false },
  { id: "6", label: "Verify room list by floor", href: "/rooms/list", priority: "low", done: false },
]

const priorityColor: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-gray-100 text-gray-700",
}

const STORAGE_KEY = "rooms-todo-list"

function loadTodos(): RoomsTodoItem[] {
  if (typeof window === "undefined") return defaultTodos
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as RoomsTodoItem[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return defaultTodos
}

function saveTodos(todos: RoomsTodoItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // ignore
  }
}

export function RoomsTodoList() {
  const [todos, setTodos] = useState<RoomsTodoItem[]>(loadTodos)
  const [newLabel, setNewLabel] = useState("")

  const toggle = (id: string) => {
    setTodos((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      saveTodos(next)
      return next
    })
  }

  const remove = (id: string) => {
    setTodos((prev) => {
      const next = prev.filter((t) => t.id !== id)
      saveTodos(next)
      return next
    })
  }

  const add = () => {
    const label = newLabel.trim()
    if (!label) return
    const newItem: RoomsTodoItem = {
      id: `new-${Date.now()}`,
      label,
      done: false,
      priority: "medium",
    }
    setTodos((prev) => {
      const next = [...prev, newItem]
      saveTodos(next)
      return next
    })
    setNewLabel("")
  }

  const pending = todos.filter((t) => !t.done)
  const completed = todos.filter((t) => t.done)

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-red-600" />
          Rooms to-do
          <Badge variant="secondary" className="text-[10px] font-normal">
            {pending.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a task…"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="text-sm h-8"
          />
          <Button size="sm" variant="outline" onClick={add} className="shrink-0 h-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="space-y-1.5">
          {pending.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-100 group"
            >
              <Checkbox
                id={item.id}
                checked={item.done}
                onCheckedChange={() => toggle(item.id)}
                className="rounded"
              />
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex-1 text-sm font-medium text-gray-900 hover:text-red-600 hover:underline min-w-0"
                >
                  {item.label}
                </Link>
              ) : (
                <label
                  htmlFor={item.id}
                  className="flex-1 text-sm font-medium text-gray-900 cursor-pointer min-w-0"
                >
                  {item.label}
                </label>
              )}
              {item.priority && (
                <Badge className={`text-[10px] shrink-0 ${priorityColor[item.priority] ?? ""}`}>
                  {item.priority}
                </Badge>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
          {completed.length > 0 && (
            <>
              {completed.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50/50 border border-gray-100 group opacity-75"
                >
                  <Checkbox
                    id={`done-${item.id}`}
                    checked={true}
                    onCheckedChange={() => toggle(item.id)}
                    className="rounded"
                  />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex-1 text-sm text-gray-500 line-through min-w-0"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <label
                      htmlFor={`done-${item.id}`}
                      className="flex-1 text-sm text-gray-500 line-through cursor-pointer min-w-0"
                    >
                      {item.label}
                    </label>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600"
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </>
          )}
        </ul>
        {todos.length === 0 && (
          <p className="text-sm text-gray-500 py-4 text-center flex items-center justify-center gap-2">
            <Circle className="h-4 w-4" />
            No tasks. Add one above.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
