'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/auth-context'
import { Loader2, BookOpen, Search } from 'lucide-react'
import CreateAccountHead from './CreateAccountHead'
import EditDeleteAccount from './EditDeleteAccount'
import AccountClassification from './AccountClassification'
import ParentSubAccounts from './ParentSubAccounts'
import AccountTypeSelector from './AccountTypeSelector'
import AccountCodeGenerator from './AccountCodeGenerator'
import AccountStatusToggle from './AccountStatusToggle'
import OpeningBalanceSetup from './OpeningBalanceSetup'
import HierarchicalView from './HierarchicalView'

export default function ChartOfAccounts() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState([])
  const [tree, setTree] = useState([])
  const [typeFilter, setTypeFilter] = useState(null)
  const [search, setSearch] = useState('')

  const apiBase = effectiveHotelId ? `http://localhost:5000/api/hotel-data/${effectiveHotelId}` : ''

  const loadData = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (typeFilter) params.set('accountType', typeFilter)
      const res = await fetch(`${apiBase}/chart-of-accounts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAccounts(data.accounts || [])
        setTree(data.tree || [])
      }
    } catch (error) {
      console.error('Chart of accounts load error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [effectiveHotelId, typeFilter])

  const filteredTree = search.trim()
    ? tree.map((node) => filterTree(node, search.trim().toLowerCase())).filter(Boolean)
    : tree

  if (!effectiveHotelId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="h-14 w-14 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Select a hotel or log in with a hotel account to manage the chart of accounts.</p>
        </div>
      </div>
    )
  }

  if (loading && accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-600">Loading chart of accounts...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600 mt-1">Manage account heads, hierarchy, and opening balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateAccountHead accounts={accounts} apiBase={apiBase} onCreated={loadData} />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <AccountClassification accounts={accounts} selectedType={typeFilter} onSelectType={setTypeFilter} />
          <div className="relative">
            <input
              type="text"
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
          </div>
          <HierarchicalView
            tree={filteredTree}
            accounts={accounts}
            apiBase={apiBase}
            onUpdated={loadData}
            onDeleted={loadData}
            filter={typeFilter}
          />
        </div>
      </div>
    </div>
  )
}

function filterTree(node, q) {
  const match = (node.code && node.code.toLowerCase().includes(q)) || (node.name && node.name.toLowerCase().includes(q))
  const children = (node.children || []).map((c) => filterTree(c, q)).filter(Boolean)
  if (match || children.length > 0) {
    return { ...node, children }
  }
  return null
}
