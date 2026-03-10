"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type Props = {
  faqs: FAQ[];
};

export function FAQSection({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Card className="border-0 bg-gradient-to-br from-yellow-400/10 via-amber-300/5 to-orange-300/10 backdrop-blur">
      <div className="p-4 border-b border-amber-300/60">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-50">
          Frequently Asked Questions
        </p>
        <p className="text-[11px] text-amber-900/70 dark:text-amber-100/80">
          Common questions, troubleshooting tips, and quick answers.
        </p>
      </div>
      <div className="p-4 space-y-1.5 text-xs">
        {faqs.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div
              key={f.id}
              className="rounded-md border border-amber-200/70 bg-white/70 dark:border-amber-700/50 dark:bg-slate-900/60"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : f.id)}
                className="flex w-full items-center justify-between px-3 py-2 text-left"
              >
                <span className="font-semibold text-amber-900 dark:text-amber-50">
                  {f.question}
                </span>
                <span className="text-[11px] text-amber-800/80 dark:text-amber-100/80">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-3 pb-2 text-[11px] text-amber-900/90 dark:text-amber-100/90">
                  {f.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

