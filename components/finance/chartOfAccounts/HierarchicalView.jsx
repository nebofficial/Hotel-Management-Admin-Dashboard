'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, ChevronDown, TreePine, Search } from 'lucide-react'
import EditDeleteAccount from './EditDeleteAccount'

const TYPE_COLORS = {
  Asset: 'bg-green-100 text-green-800',
  Liability: 'bg-red-100 text-red-800',
  Income: 'bg-blue-100 text-blue-800',
  Expense: 'bg-amber-100 text-amber-800',
  Equity: 'bg-purple-100 text-purple-800',
}

function TreeNode({ node, level, accounts, apiBase, onUpdated, onDeleted }) {
  const [expanded, setExpanded] = useState(level < 1)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200"
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 rounded"
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <span className="w-4 inline-block" />
          )}
        </button>
        <span className="font-mono text-sm font-medium text-gray-800 w-16">{node.code}</span>
        <span className="flex-1 text-sm text-gray-900">{node.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[node.accountType] || 'bg-gray-100 text-gray-700'}`}>
          {node.accountType}
        </span>
        <span className={`text-xs font-medium ${node.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
          {node.status}
        </span>
        <EditDeleteAccount
          account={node}
          accounts={accounts}
          apiBase={apiBase}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              accounts={accounts}
              apiBase={apiBase}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HierarchicalView({ tree, accounts, apiBase, onUpdated, onDeleted, filter }) {
  const filteredTree = filter
    ? (tree || []).filter((n) => n.accountType === filter)
    : (tree || [])

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
      <CardHeader className="pb-2 bg-gradient-to-br from-slate-50 to-blue-50 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <TreePine className="h-5 w-5 text-green-600" />
          Hierarchical View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {filteredTree.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No accounts to display.</p>
          ) : (
            filteredTree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                accounts={accounts}
                apiBase={apiBase}
                onUpdated={onUpdated}
                onDeleted={onDeleted}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
