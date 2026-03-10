'use client'

import Link from 'next/link'
import { FileText, BarChart3, ClipboardList, Users, Wallet } from 'lucide-react'

const quickLinks = [
  {
    id: 'financial',
    label: 'Financial Reports',
    description: 'Profit & Loss, Balance Sheet, Trial Balance',
    href: '/accounting/profit-loss',
    icon: Wallet,
    gradient: 'from-rose-500 to-red-500',
  },
  {
    id: 'reservations',
    label: 'Reservation Reports',
    description: 'Occupancy, ADR, RevPAR, booking channels',
    href: '/reservations/dashboard',
    icon: BarChart3,
    gradient: 'from-sky-500 to-cyan-500',
  },
  {
    id: 'inventory',
    label: 'Inventory Reports',
    description: 'Stock, purchase, supplier & expiry',
    href: '/reports/inventory',
    icon: ClipboardList,
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  {
    id: 'hr',
    label: 'HR / Payroll Reports',
    description: 'Payroll, attendance, staff performance',
    href: '/staff/payroll',
    icon: Users,
    gradient: 'from-emerald-500 to-lime-500',
  },
  {
    id: 'billing',
    label: 'Billing & Invoices',
    description: 'Room bills, restaurant, refunds, credit notes',
    href: '/billing/dashboard',
    icon: FileText,
    gradient: 'from-amber-500 to-orange-500',
  },
]

export function QuickReportsNavigation() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-700">Quick access to detailed reports</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.id}
              href={link.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${link.gradient} text-white shadow-md px-4 py-3 flex items-start gap-3`}
            >
              <div className="mt-0.5">
                <Icon className="w-5 h-5 opacity-90" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold leading-snug group-hover:underline">{link.label}</p>
                <p className="text-[11px] opacity-90 leading-snug">{link.description}</p>
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

