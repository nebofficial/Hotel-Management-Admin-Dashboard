"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchTodayCheckins,
  fetchTodayCheckouts,
  processQuickCheckin,
  processQuickCheckout,
} from "@/services/api/todayActivityApi";
import { CheckinsTodayTable } from "./CheckinsTodayTable";
import { CheckoutsTodayTable } from "./CheckoutsTodayTable";
import { ReservationStatusFilter } from "./ReservationStatusFilter";

export type TodayActivityItem = {
  id: string;
  bookingNumber: string;
  guestName: string;
  guestPhone?: string;
  roomNumber?: string | null;
  roomType?: string | null;
  roomStatus?: string | null;
  checkIn?: string;
  checkOut?: string;
  status: string;
};

export default function TodayActivityDashboard() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [checkins, setCheckins] = useState<TodayActivityItem[]>([]);
  const [checkouts, setCheckouts] = useState<TodayActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const param =
        statusFilter === "all"
          ? {}
          : statusFilter === "pending_checkin"
          ? { status: "pending" }
          : statusFilter === "checked_in"
          ? { status: "checked_in" }
          : statusFilter === "pending_checkout"
          ? { status: "pending_checkout" }
          : { status: "checked_out" };

      const [ci, co] = await Promise.all([
        fetchTodayCheckins(user.hotelId, param),
        fetchTodayCheckouts(user.hotelId, param),
      ]);
      setCheckins(ci.items || []);
      setCheckouts(co.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load today's front office activity"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleQuickCheckin = async (id: string) => {
    if (!user?.hotelId) return;
    setMutatingId(id);
    setError(null);
    try {
      await processQuickCheckin(user.hotelId, id);
      await load();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to process quick check-in"
      );
    } finally {
      setMutatingId(null);
    }
  };

  const handleQuickCheckout = async (id: string) => {
    if (!user?.hotelId) return;
    setMutatingId(id);
    setError(null);
    try {
      await processQuickCheckout(user.hotelId, id);
      await load();
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to process quick check-out"
      );
    } finally {
      setMutatingId(null);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">Today's Check-ins / Check-outs</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to view today&apos;s activity.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Today&apos;s Check-ins / Check-outs</h1>
          <p className="text-xs text-muted-foreground">
            Live arrivals and departures for the front office.
          </p>
        </div>
        <ReservationStatusFilter
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground">
          Loading today&apos;s activity...
        </p>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CheckinsTodayTable
          items={checkins}
          onQuickCheckin={handleQuickCheckin}
          mutatingId={mutatingId}
        />
        <CheckoutsTodayTable
          items={checkouts}
          onQuickCheckout={handleQuickCheckout}
          mutatingId={mutatingId}
        />
      </section>
    </main>
  );
}

