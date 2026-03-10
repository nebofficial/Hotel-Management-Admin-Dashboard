"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type SearchResult = {
  type: string;
  title: string;
  snippet: string;
};

type Props = {
  onSearch: (query: string) => Promise<SearchResult[]>;
};

export function HelpSearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await onSearch(query.trim());
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Search Help Topics
        </p>
        <p className="text-[11px] text-slate-700 dark:text-slate-300">
          Type a keyword to search across guides, tutorials, and FAQs.
        </p>
      </div>
      <div className="p-4 space-y-3 text-xs">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            className="h-9 text-xs"
            placeholder="Search help topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="bg-slate-900 text-slate-50"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
        <div className="space-y-1.5 max-h-40 overflow-auto">
          {results.map((r, idx) => (
            <div
              key={`${r.type}-${idx}`}
              className="rounded-md border border-slate-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70"
            >
              <p className="text-[11px] font-semibold text-slate-900 dark:text-slate-50">
                [{r.type}] {r.title}
              </p>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                {r.snippet}
              </p>
            </div>
          ))}
          {!loading && query && results.length === 0 && (
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              No results found for "{query}".
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

