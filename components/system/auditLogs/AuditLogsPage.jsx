'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuditLogsHeader } from './AuditLogsHeader'
import { AuditSummaryCards } from './AuditSummaryCards'
import { AuditLogsFilters } from './AuditLogsFilters'
import { LoginActivityLogs } from './LoginActivityLogs'
import { SystemChangeLogs } from './SystemChangeLogs'
import { DataModificationLogs } from './DataModificationLogs'
import { RolePermissionLogs } from './RolePermissionLogs'
import { TransactionActivityLogs } from './TransactionActivityLogs'
import { AuditLogsTable } from './AuditLogsTable'
import { AuditLogsExport } from './AuditLogsExport'
import {
  fetchLoginActivity,
  fetchSystemChanges,
  fetchDataModificationLogs,
  fetchRolePermissionLogs,
  fetchTransactionLogs,
} from '@/services/api/auditLogsApi'

function getApiBase(searchParams) {
  const base = searchParams.get('apiBase')
  if (base) return base
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem('apiBase') || ''
}

export default function AuditLogsPage() {
  const searchParams = useSearchParams()
  const [apiBase, setApiBase] = useState('')

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [user, setUser] = useState('')
  const [module, setModule] = useState('')
  const [actionType, setActionType] = useState('')

  const [loginData, setLoginData] = useState({ logs: [] })
  const [systemChanges, setSystemChanges] = useState({ logs: [] })
  const [dataMods, setDataMods] = useState({ logs: [] })
  const [rolePerms, setRolePerms] = useState({ logs: [] })
  const [transactions, setTransactions] = useState({ logs: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setApiBase(getApiBase(searchParams))
  }, [searchParams])

  const refresh = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const params = { startDate, endDate, user, module, actionType }
      const [login, sys, mods, rp, tx] = await Promise.all([
        fetchLoginActivity(apiBase, params),
        fetchSystemChanges(apiBase, params),
        fetchDataModificationLogs(apiBase, params),
        fetchRolePermissionLogs(apiBase, params),
        fetchTransactionLogs(apiBase, params),
      ])
      setLoginData(login || { logs: [] })
      setSystemChanges(sys || { logs: [] })
      setDataMods(mods || { logs: [] })
      setRolePerms(rp || { logs: [] })
      setTransactions(tx || { logs: [] })
    } catch (e) {
      console.error('Failed to load audit logs', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiBase) {
      refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  const summary = useMemo(() => {
    const total =
      (loginData.logs?.length || 0) +
      (systemChanges.logs?.length || 0) +
      (dataMods.logs?.length || 0) +
      (rolePerms.logs?.length || 0) +
      (transactions.logs?.length || 0)

    const todayStr = new Date().toISOString().slice(0, 10)
    const dataChangesToday = (dataMods.logs || []).filter(
      (l) => (l.createdAt || '').slice(0, 10) === todayStr,
    ).length

    return {
      totalActivities: total,
      userLoginsToday: (loginData.logs || []).filter(
        (l) => (l.loginTime || l.createdAt || '').slice(0, 10) === todayStr,
      ).length,
      dataChangesToday,
      securityAlerts: (rolePerms.logs || []).length,
    }
  }, [loginData, systemChanges, dataMods, rolePerms, transactions])

  const combinedLogs = useMemo(() => {
    const all = [
      ...(loginData.logs || []),
      ...(systemChanges.logs || []),
      ...(dataMods.logs || []),
      ...(rolePerms.logs || []),
      ...(transactions.logs || []),
    ]
    return all.sort((a, b) =>
      (b.createdAt || b.timestamp || b.loginTime || '').toString().localeCompare(
        (a.createdAt || a.timestamp || a.loginTime || '').toString(),
      ),
    )
  }, [loginData, systemChanges, dataMods, rolePerms, transactions])

  const resetFilters = () => {
    setStartDate(null)
    setEndDate(null)
    setUser('')
    setModule('')
    setActionType('')
    refresh()
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <AuditLogsHeader onRefresh={refresh} loading={loading} />
      <AuditSummaryCards summary={summary} />
      <AuditLogsFilters
        startDate={startDate}
        endDate={endDate}
        user={user}
        module={module}
        actionType={actionType}
        onChangeStart={setStartDate}
        onChangeEnd={setEndDate}
        onChangeUser={setUser}
        onChangeModule={setModule}
        onChangeActionType={setActionType}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LoginActivityLogs logs={loginData.logs} loading={loading} />
        <SystemChangeLogs logs={systemChanges.logs} loading={loading} />
        <DataModificationLogs logs={dataMods.logs} loading={loading} />
        <RolePermissionLogs logs={rolePerms.logs} loading={loading} />
      </div>

      <TransactionActivityLogs logs={transactions.logs} loading={loading} />

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">
          Showing last {combinedLogs.length} activities across all categories.
        </p>
        <AuditLogsExport apiBase={apiBase} filters={{ startDate, endDate }} combinedLogs={combinedLogs} />
      </div>

      <AuditLogsTable logs={combinedLogs} loading={loading} />
    </main>
  )
}

