"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/auth-context";
import { fetchRules, updateRules } from "@/services/api/checkinCheckoutRulesApi";
import { RulesHeader } from "./RulesHeader";
import { StandardTimesPanel } from "./StandardTimesPanel";
import { EarlyCheckinPolicyPanel } from "./EarlyCheckinPolicyPanel";
import { LateCheckoutPolicyPanel } from "./LateCheckoutPolicyPanel";
import { AdditionalChargesPanel } from "./AdditionalChargesPanel";
import { GracePeriodSettings } from "./GracePeriodSettings";
import { AutoCheckoutSettings } from "./AutoCheckoutSettings";
import { PolicyNotesEditor } from "./PolicyNotesEditor";
import { SaveRulesButton } from "./SaveRulesButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

const defaultRules = {
  standardCheckInTime: "14:00",
  standardCheckOutTime: "11:00",
  allowEarlyCheckin: false,
  earliestCheckinTime: "",
  earlyCheckinFeeType: "fixed",
  earlyCheckinFee: 0,
  allowLateCheckout: false,
  latestCheckoutTime: "",
  lateCheckoutFeeType: "fixed",
  lateCheckoutFee: 0,
  hourlyExtensionRate: 0,
  gracePeriodMinutes: 0,
  chargeAfterGracePeriod: true,
  autoCheckoutAfterMinutes: 0,
  sendCheckoutReminder: false,
  policyNotes: "",
  specialInstructions: "",
};

export type RulesState = typeof defaultRules;

export default function CheckinCheckoutRulesDashboard() {
  const { user } = useAuth();
  const [rules, setRules] = useState<RulesState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialRules, setInitialRules] = useState<RulesState | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRules(API_BASE, user.hotelId);
      const r = data.rules || data;
      const next = { ...defaultRules, ...r };
      setRules(next);
      setInitialRules(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load rules");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = useCallback((field: keyof RulesState, value: string | number | boolean) => {
    setRules((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const handleSave = async () => {
    if (!user?.hotelId || !rules) return;
    setSaving(true);
    setError(null);
    try {
      const data = await updateRules(API_BASE, user.hotelId, rules);
      const updated = data.rules || data;
      setRules((prev) => (prev ? { ...prev, ...updated } : prev));
      setInitialRules((prev) => (prev ? { ...prev, ...updated } : prev));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialRules) setRules({ ...initialRules });
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <RulesHeader />
        <p className="text-sm text-muted-foreground">Sign in with a hotel account to manage check-in/check-out rules.</p>
      </main>
    );
  }

  if (loading || !rules) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <RulesHeader />
        <p className="text-sm text-muted-foreground">{loading ? "Loading rules..." : "No rules data."}</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <RulesHeader />
      {error && (
        <Alert variant="destructive" className="max-w-xl">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <StandardTimesPanel
          standardCheckInTime={rules.standardCheckInTime}
          standardCheckOutTime={rules.standardCheckOutTime}
          onChange={handleChange}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <EarlyCheckinPolicyPanel
            allowEarlyCheckin={rules.allowEarlyCheckin}
            earliestCheckinTime={rules.earliestCheckinTime}
            earlyCheckinFeeType={rules.earlyCheckinFeeType}
            earlyCheckinFee={rules.earlyCheckinFee}
            onChange={handleChange}
          />
          <LateCheckoutPolicyPanel
            allowLateCheckout={rules.allowLateCheckout}
            latestCheckoutTime={rules.latestCheckoutTime}
            lateCheckoutFeeType={rules.lateCheckoutFeeType}
            lateCheckoutFee={rules.lateCheckoutFee}
            onChange={handleChange}
          />
        </div>
        <AdditionalChargesPanel
          earlyCheckinFee={rules.earlyCheckinFee}
          lateCheckoutFee={rules.lateCheckoutFee}
          hourlyExtensionRate={rules.hourlyExtensionRate}
          onChange={handleChange}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <GracePeriodSettings
            gracePeriodMinutes={rules.gracePeriodMinutes}
            chargeAfterGracePeriod={rules.chargeAfterGracePeriod}
            onChange={handleChange}
          />
          <AutoCheckoutSettings
            autoCheckoutAfterMinutes={rules.autoCheckoutAfterMinutes}
            sendCheckoutReminder={rules.sendCheckoutReminder}
            onChange={handleChange}
          />
        </div>
        <PolicyNotesEditor
          policyNotes={rules.policyNotes}
          specialInstructions={rules.specialInstructions}
          onChange={handleChange}
        />
        <SaveRulesButton saving={saving} onSave={handleSave} onReset={handleReset} />
      </div>
    </main>
  );
}
