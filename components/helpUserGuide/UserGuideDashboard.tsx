"use client";

import { useEffect, useState } from "react";
import {
  fetchDocuments,
  fetchFAQs,
  fetchGuides,
  fetchTutorials,
  searchHelpTopics,
  downloadDocumentation,
} from "@/services/api/userGuideApi";
import { SystemOverviewGuide } from "./SystemOverviewGuide";
import { ModuleUserManuals } from "./ModuleUserManuals";
import { StepByStepTutorials } from "./StepByStepTutorials";
import { FAQSection } from "./FAQSection";
import { VideoTutorials } from "./VideoTutorials";
import { HelpSearchBar } from "./HelpSearchBar";
import { DocumentationDownloads } from "./DocumentationDownloads";
import { Alert, AlertDescription } from "@/components/ui/alert";

type GuidesResponse = {
  overview: {
    title: string;
    sections: { id: string; title: string; summary: string }[];
  };
  modules: { id: string; name: string; description: string }[];
};

export default function UserGuideDashboard() {
  const [guides, setGuides] = useState<GuidesResponse | null>(null);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [guidesRes, tutorialsRes, faqsRes, docsRes] = await Promise.all([
          fetchGuides(),
          fetchTutorials(),
          fetchFAQs(),
          fetchDocuments(),
        ]);
        if (cancelled) return;
        setGuides(guidesRes);
        setTutorials(tutorialsRes.items || []);
        setFaqs(faqsRes.items || []);
        setDocuments(docsRes.items || []);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load user guide data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async (q: string) => {
    const res = await searchHelpTopics(q);
    return res.items || [];
  };

  const handleDownload = async (id: string) => {
    const res = await downloadDocumentation(id);
    const doc = res.document;
    if (doc?.url && typeof window !== "undefined") {
      window.open(doc.url, "_blank");
    }
  };

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">User Guide</h1>
          <p className="text-xs text-muted-foreground">
            Documentation, tutorials, FAQs, and downloads to help your team use
            the system effectively.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 2xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          {guides && (
            <SystemOverviewGuide sections={guides.overview.sections || []} />
          )}
          {guides && <ModuleUserManuals modules={guides.modules || []} />}
          <StepByStepTutorials tutorials={tutorials} />
          <FAQSection faqs={faqs} />
        </div>

        <div className="space-y-3">
          <VideoTutorials
            tutorials={tutorials.map((t) => ({
              id: t.id,
              title: t.title,
              module: t.module,
              videoUrl: t.videoUrl,
            }))}
          />
          <HelpSearchBar onSearch={handleSearch} />
          <DocumentationDownloads
            documents={documents}
            onDownload={handleDownload}
          />
        </div>
      </section>
    </main>
  );
}

