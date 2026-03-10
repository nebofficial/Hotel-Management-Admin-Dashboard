"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export function HelpResourcesSummary() {
  const links = [
    { label: "User Guides", href: "/help/guide" },
    { label: "Knowledge Base", href: "/help/guide" },
    { label: "Video Tutorials", href: "/help/guide" },
    { label: "API Documentation", href: "/help/guide" },
  ];

  return (
    <Card className="border-0 bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-indigo-400/10 backdrop-blur">
      <div className="p-4 border-b border-sky-500/40">
        <p className="text-sm font-semibold text-sky-900 dark:text-sky-50">
          Help Resources Summary
        </p>
        <p className="text-[11px] text-sky-900/70 dark:text-sky-100/80">
          Quick access to documentation and learning materials.
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-md border border-sky-200/60 bg-white/60 px-3 py-2 text-sky-900 shadow-sm hover:border-sky-500 hover:bg-sky-50 transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}

