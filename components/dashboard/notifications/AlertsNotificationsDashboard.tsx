"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchNotifications,
  fetchLowAvailabilityAlerts,
  fetchPaymentAlerts,
  fetchMaintenanceAlerts,
} from "@/services/api/notificationApi";
import { LowRoomAvailabilityAlert } from "./LowRoomAvailabilityAlert";
import { PendingReservationsAlert } from "./PendingReservationsAlert";
import { PaymentPendingAlert } from "./PaymentPendingAlert";
import { SystemUpdateNotification } from "./SystemUpdateNotification";
import { GuestRequestNotification } from "./GuestRequestNotification";
import { MaintenanceAlert } from "./MaintenanceAlert";
import { StaffAlertNotification } from "./StaffAlertNotification";
import { RealTimeNotificationFeed } from "./RealTimeNotificationFeed";

export type NotificationItem = {
  id: string;
  type: string;
  level: "info" | "warning" | "critical";
  title: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string | Date;
  meta?: Record<string, any>;
  source?: string;
};

export default function AlertsNotificationsDashboard() {
  const { user } = useAuth();
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [lowAvailability, setLowAvailability] = useState<NotificationItem[]>([]);
  const [payments, setPayments] = useState<NotificationItem[]>([]);
  const [maintenance, setMaintenance] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [allRes, lowRes, payRes, maintRes] = await Promise.all([
        fetchNotifications(user.hotelId),
        fetchLowAvailabilityAlerts(user.hotelId),
        fetchPaymentAlerts(user.hotelId),
        fetchMaintenanceAlerts(user.hotelId),
      ]);

      setAllNotifications(allRes.items || []);
      setLowAvailability(lowRes.items || []);
      setPayments(payRes.items || []);
      setMaintenance(maintRes.items || []);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <h1 className="text-lg font-semibold">Alerts &amp; Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to view operational alerts.
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Alerts &amp; Notifications</h1>
          <p className="text-xs text-muted-foreground">
            Real-time overview of operational alerts, payments, and system
            updates.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground">
          Loading notifications...
        </p>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] gap-4">
        <div className="space-y-3">
          <LowRoomAvailabilityAlert alerts={lowAvailability} />
          <PendingReservationsAlert all={allNotifications} />
          <PaymentPendingAlert alerts={payments} />
          <SystemUpdateNotification all={allNotifications} />
        </div>

        <div className="space-y-3">
          <GuestRequestNotification all={allNotifications} />
          <MaintenanceAlert alerts={maintenance} />
          <StaffAlertNotification all={allNotifications} />
          <RealTimeNotificationFeed items={allNotifications} />
        </div>
      </section>
    </main>
  );
}

