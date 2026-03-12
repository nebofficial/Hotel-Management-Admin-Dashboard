"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/app/auth-context";
import { fetchNotifications } from "@/services/api/notificationApi";
import { NotificationDropdown } from "./NotificationDropdown";

type NotificationItem = {
  id: string;
  isRead?: boolean;
  title: string;
  message?: string;
  createdAt?: string | Date;
};

export function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.hotelId) return;
      try {
        const res = await fetchNotifications(user.hotelId);
        if (!cancelled) {
          setItems(res.items || []);
        }
      } catch {
        // ignore errors in bell icon
      }
    }

    void load();

    const interval = setInterval(() => {
      void load();
    }, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user?.hotelId]);

  if (!user?.hotelId) return null;

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-900/40 text-amber-100 hover:bg-red-800/70 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-amber-400 text-red-900 text-[10px] font-bold px-1.5 py-0.5">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-md bg-white shadow-lg border border-slate-200 z-50">
          <NotificationDropdown items={items} />
        </div>
      )}
    </div>
  );
}

