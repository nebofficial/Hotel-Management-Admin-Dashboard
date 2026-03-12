"use client";

type NotificationItem = {
  id: string;
  title: string;
  message?: string;
  createdAt?: string | Date;
};

type Props = {
  items: NotificationItem[];
};

export function NotificationDropdown({ items }: Props) {
  const latest = (items || []).slice(0, 8);

  return (
    <div className="max-h-80 overflow-auto py-2 text-xs">
      {latest.length === 0 ? (
        <p className="px-3 py-2 text-slate-600">
          No notifications yet. You&apos;re all caught up.
        </p>
      ) : (
        latest.map((n) => (
          <div
            key={n.id}
            className="px-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50"
          >
            <p className="font-semibold text-slate-900 text-[11px]">
              {n.title}
            </p>
            {n.message && (
              <p className="text-[11px] text-slate-700 line-clamp-2">
                {n.message}
              </p>
            )}
            {n.createdAt && (
              <p className="text-[10px] text-slate-500 mt-0.5">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

