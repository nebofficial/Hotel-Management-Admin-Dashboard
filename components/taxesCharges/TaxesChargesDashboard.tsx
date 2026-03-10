"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth-context";
import {
  fetchTaxRules,
  createTaxRule,
  updateTaxRule,
  toggleTaxRuleStatus,
  deleteTaxRule,
} from "@/services/api/taxesChargesApi";
import { TaxesHeader } from "./TaxesHeader";
import { TaxesTable } from "./TaxesTable";
import { CreateTaxRuleModal, type DraftTaxRule } from "./CreateTaxRuleModal";
import { EditTaxRuleModal, type TaxRule } from "./EditTaxRuleModal";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export default function TaxesChargesDashboard() {
  const { user } = useAuth();
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTaxRules(API_BASE, user.hotelId);
      const list: TaxRule[] = data.rules || data || [];
      setRules(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load tax rules");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const overview = useMemo(() => {
    const total = rules.length;
    const active = rules.filter((r) => r.active).length;
    const service = rules.filter((r) => r.type === "SERVICE").length;
    const city = rules.filter((r) => r.type === "CITY").length;
    return { total, active, service, city };
  }, [rules]);

  const handleCreate = async (draft: DraftTaxRule) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const payload = {
        name: draft.name,
        type: draft.type,
        percentage: draft.type === "CITY" ? null : draft.percentage,
        scope: draft.scope,
        cityTaxMode: draft.type === "CITY" ? draft.cityTaxMode || null : null,
        cityTaxAmount: draft.type === "CITY" ? draft.cityTaxAmount || null : null,
        priority: draft.priority || 1,
        active: true,
      };
      const data = await createTaxRule(API_BASE, user.hotelId, payload);
      const created: TaxRule = data.rule || data;
      setRules((prev) => [created, ...prev]);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<TaxRule>) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const payload = {
        name: updates.name,
        type: updates.type,
        percentage: updates.type === "CITY" ? null : updates.percentage,
        scope: updates.scope,
        cityTaxMode: updates.type === "CITY" ? updates.cityTaxMode || null : null,
        cityTaxAmount: updates.type === "CITY" ? updates.cityTaxAmount || null : null,
        priority: updates.priority,
        active: updates.active,
      };
      const data = await updateTaxRule(API_BASE, user.hotelId, id, payload);
      const updated: TaxRule = data.rule || data;
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (rule: TaxRule) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const data = await toggleTaxRuleStatus(API_BASE, user.hotelId, rule.id, !rule.active);
      const updated: TaxRule = data.rule || data;
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rule: TaxRule) => {
    if (!user?.hotelId) return;
    if (!window.confirm(`Delete tax rule "${rule.name}"?`)) return;
    setSaving(true);
    try {
      await deleteTaxRule(API_BASE, user.hotelId, rule.id);
      setRules((prev) => prev.filter((r) => r.id !== rule.id));
    } finally {
      setSaving(false);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <TaxesHeader onAdd={() => {}} />
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage taxes &amp; charges.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <TaxesHeader onAdd={() => {}} />
        <p className="text-sm text-muted-foreground">Loading tax rules...</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <TaxesHeader onAdd={() => setCreateOpen(true)} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-400/10 via-emerald-300/10 to-teal-400/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Total Tax Rules</p>
            <p className="text-xl font-semibold text-emerald-900">{overview.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-lime-400/10 to-emerald-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Active Taxes</p>
            <p className="text-xl font-semibold text-emerald-900">{overview.active}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-amber-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-amber-900/80 font-medium">Service Charges</p>
            <p className="text-xl font-semibold text-amber-900">{overview.service}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-rose-400/10 via-red-400/10 to-rose-300/10 shadow-sm">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-rose-900/80 font-medium">City Taxes</p>
            <p className="text-xl font-semibold text-rose-900">{overview.city}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.5fr)] gap-4">
        <TaxesTable
          rules={rules}
          onEdit={(rule) => {
            setEditingRule(rule);
            setEditOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />

        <div className="space-y-3">
          <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-yellow-300/10 to-amber-300/10">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-semibold text-amber-900">GST / VAT Configuration</p>
              <p className="text-[11px] text-amber-900/80">
                Use GST / VAT type rules to configure government taxes on rooms and services.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-amber-300/10">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-semibold text-orange-900">Service Charge Setup</p>
              <p className="text-[11px] text-orange-900/80">
                Configure service charge rules (e.g. Restaurant / Rooms / Spa) using the Service type.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-red-500/10 via-rose-400/10 to-red-300/10">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-semibold text-red-900">City Tax Configuration</p>
              <p className="text-[11px] text-red-900/80">
                Create City type rules for per-night, per-guest, or fixed city fees.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-slate-100">
            <CardContent className="p-3 space-y-1">
              <p className="text-sm font-semibold">Tax Priority Settings</p>
              <p className="text-[11px] text-slate-200/80">
                Use the priority field on each rule to control the tax calculation order and stacked taxes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <CreateTaxRuleModal open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
      <EditTaxRuleModal
        open={editOpen}
        onOpenChange={setEditOpen}
        rule={editingRule}
        onSave={handleUpdate}
      />
    </main>
  );
}

