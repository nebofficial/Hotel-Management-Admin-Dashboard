"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/auth-context";
import {
  fetchInvoiceTemplates,
  createInvoiceTemplate,
  updateInvoiceTemplate,
  deleteInvoiceTemplate,
  previewInvoiceTemplate,
} from "@/services/api/invoiceTemplatesApi";
import { InvoiceTemplatesHeader } from "./InvoiceTemplatesHeader";
import {
  InvoiceTemplatesTable,
  type InvoiceTemplateRow,
} from "./InvoiceTemplatesTable";
import {
  CreateInvoiceTemplateModal,
  type DraftInvoiceTemplate,
} from "./CreateInvoiceTemplateModal";
import {
  EditInvoiceTemplateModal,
  type InvoiceTemplate as InvoiceTemplateFull,
} from "./EditInvoiceTemplateModal";
import {
  HotelBrandingPanel,
  type BrandingConfig,
} from "./HotelBrandingPanel";
import {
  InvoiceFieldsCustomizer,
  type FieldsConfig,
} from "./InvoiceFieldsCustomizer";
import { TaxDisplaySettings } from "./TaxDisplaySettings";
import { FooterNotesEditor } from "./FooterNotesEditor";
import { InvoicePreviewPanel } from "./InvoicePreviewPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000";

export default function InvoiceTemplatesDashboard() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<InvoiceTemplateRow[]>([]);
  const [selected, setSelected] = useState<InvoiceTemplateFull | null>(null);
  const [branding, setBranding] = useState<BrandingConfig>({
    logoUrl: "",
    brandColor: "#B91C1C",
    hotelName: "",
    address: "",
  });
  const [fieldsConfig, setFieldsConfig] = useState<FieldsConfig>({
    guestName: true,
    bookingId: true,
    roomCharges: true,
    serviceCharges: true,
    taxes: true,
    totalAmount: true,
  });
  const [taxDisplay, setTaxDisplay] = useState<"DETAILED" | "TOTAL_ONLY">("DETAILED");
  const [footerNotes, setFooterNotes] = useState("");
  const [preview, setPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user?.hotelId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvoiceTemplates(API_BASE, user.hotelId);
      const list = (data.templates || data || []) as any[];
      const mapped: InvoiceTemplateRow[] = list.map((t) => ({
        id: t.id,
        name: t.name,
        isDefault: !!t.isDefault,
        active: !!t.active,
        layoutStyle: t.layoutStyle,
        lastEditedAt: t.lastEditedAt || t.updatedAt || t.createdAt,
      }));
      setTemplates(mapped);
      if (list[0]) {
        const t = list[0];
        setSelected({
          id: t.id,
          name: t.name,
          layoutStyle: t.layoutStyle,
          isDefault: !!t.isDefault,
          active: !!t.active,
          taxDisplayMode: t.taxDisplayMode || "DETAILED",
          footerNotes: t.footerNotes || "",
        });
        const b = t.branding || {};
        setBranding({
          logoUrl: b.logoUrl || "",
          brandColor: b.brandColor || "#B91C1C",
          hotelName: b.hotelName || "",
          address: b.address || "",
        });
        const f = t.fieldsConfig || {};
        setFieldsConfig((prev) => ({
          guestName: f.guestName ?? prev.guestName,
          bookingId: f.bookingId ?? prev.bookingId,
          roomCharges: f.roomCharges ?? prev.roomCharges,
          serviceCharges: f.serviceCharges ?? prev.serviceCharges,
          taxes: f.taxes ?? prev.taxes,
          totalAmount: f.totalAmount ?? prev.totalAmount,
        }));
        setTaxDisplay((t.taxDisplayMode as any) || "DETAILED");
        setFooterNotes(t.footerNotes || "");
        const pv = await previewInvoiceTemplate(API_BASE, user.hotelId, t.id, {});
        setPreview(pv.preview || pv);
      } else {
        setSelected(null);
        setPreview(null);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load invoice templates");
    } finally {
      setLoading(false);
    }
  }, [user?.hotelId]);

  useEffect(() => {
    load();
  }, [load]);

  const overview = useMemo(() => {
    const total = templates.length;
    const activeTemplate = templates.find((t) => t.isDefault) || templates[0] || null;
    const lastEdited = templates
      .slice()
      .sort((a, b) => (a.lastEditedAt && b.lastEditedAt ? (a.lastEditedAt < b.lastEditedAt ? 1 : -1) : 0))[0] || null;
    return { total, activeTemplate, lastEdited };
  }, [templates]);

  const handleCreate = async (draft: DraftInvoiceTemplate) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const payload = {
        name: draft.name,
        layoutStyle: draft.layoutStyle,
        isDefault: draft.isDefault,
        active: draft.active,
        branding,
        fieldsConfig,
        taxDisplayMode: taxDisplay,
        footerNotes,
      };
      const data = await createInvoiceTemplate(API_BASE, user.hotelId, payload);
      const t = data.template || data;
      setTemplates((prev) => [
        {
          id: t.id,
          name: t.name,
          isDefault: !!t.isDefault,
          active: !!t.active,
          layoutStyle: t.layoutStyle,
          lastEditedAt: t.lastEditedAt || t.updatedAt,
        },
        ...prev,
      ]);
      setSelected({
        id: t.id,
        name: t.name,
        layoutStyle: t.layoutStyle,
        isDefault: !!t.isDefault,
        active: !!t.active,
        taxDisplayMode: t.taxDisplayMode || "DETAILED",
        footerNotes: t.footerNotes || "",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<InvoiceTemplateFull>) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const payload = {
        ...updates,
        branding,
        fieldsConfig,
        taxDisplayMode: updates.taxDisplayMode || taxDisplay,
        footerNotes,
      };
      const data = await updateInvoiceTemplate(API_BASE, user.hotelId, id, payload);
      const t = data.template || data;
      setTemplates((prev) =>
        prev.map((x) =>
          x.id === t.id
            ? {
                id: t.id,
                name: t.name,
                isDefault: !!t.isDefault,
                active: !!t.active,
                layoutStyle: t.layoutStyle,
                lastEditedAt: t.lastEditedAt || t.updatedAt,
              }
            : x
        )
      );
      setSelected({
        id: t.id,
        name: t.name,
        layoutStyle: t.layoutStyle,
        isDefault: !!t.isDefault,
        active: !!t.active,
        taxDisplayMode: t.taxDisplayMode || "DETAILED",
        footerNotes: t.footerNotes || "",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: InvoiceTemplateRow) => {
    if (!user?.hotelId) return;
    if (!window.confirm(`Delete invoice template "${row.name}"?`)) return;
    setSaving(true);
    try {
      await deleteInvoiceTemplate(API_BASE, user.hotelId, row.id);
      setTemplates((prev) => prev.filter((t) => t.id !== row.id));
      if (selected?.id === row.id) {
        setSelected(null);
        setPreview(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async (row: InvoiceTemplateRow) => {
    if (!user?.hotelId) return;
    setSaving(true);
    try {
      const pv = await previewInvoiceTemplate(API_BASE, user.hotelId, row.id, {});
      setPreview(pv.preview || pv);
    } finally {
      setSaving(false);
    }
  };

  if (!user?.hotelId) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <InvoiceTemplatesHeader onCreate={() => {}} />
        <p className="text-sm text-muted-foreground">
          Sign in with a hotel account to manage invoice templates.
        </p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-4 md:p-6 space-y-4">
        <InvoiceTemplatesHeader onCreate={() => {}} />
        <p className="text-sm text-muted-foreground">Loading invoice templates...</p>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 space-y-4">
      <InvoiceTemplatesHeader onCreate={() => setCreateOpen(true)} />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-400/10 via-emerald-300/10 to-teal-400/10">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Total Templates</p>
            <p className="text-xl font-semibold text-emerald-900">{overview.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-lime-400/10 to-emerald-300/10">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-emerald-900/80 font-medium">Active Template</p>
            <p className="text-xs text-emerald-900">
              {overview.activeTemplate?.name || "None selected"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-sky-400/10 via-sky-300/10 to-indigo-300/10">
          <CardContent className="p-3 space-y-1">
            <p className="text-[11px] text-sky-900/80 font-medium">Last Edited Template</p>
            <p className="text-xs text-sky-900">
              {overview.lastEdited?.name || "No edits yet"}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.6fr)] gap-4">
        <InvoiceTemplatesTable
          templates={templates}
          onEdit={(row) => {
            if (!row) return;
            setSelected({
              id: row.id,
              name: row.name,
              layoutStyle: row.layoutStyle,
              isDefault: row.isDefault,
              active: row.active,
              taxDisplayMode: taxDisplay,
              footerNotes,
            });
            setEditOpen(true);
          }}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />

        <div className="space-y-3">
          <HotelBrandingPanel
            value={branding}
            onChange={(patch) => setBranding((prev) => ({ ...prev, ...patch }))}
          />
          <InvoiceFieldsCustomizer
            value={fieldsConfig}
            onChange={(patch) =>
              setFieldsConfig((prev) => ({
                ...prev,
                ...patch,
              }))
            }
          />
          <TaxDisplaySettings mode={taxDisplay} onChange={setTaxDisplay} />
          <FooterNotesEditor value={footerNotes} onChange={setFooterNotes} />
        </div>
      </section>

      <section className="grid grid-cols-1">
        <InvoicePreviewPanel
          templateName={selected?.name || "Preview Template"}
          branding={branding}
          sample={preview}
        />
      </section>

      <CreateInvoiceTemplateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
      />
      <EditInvoiceTemplateModal
        open={editOpen}
        onOpenChange={setEditOpen}
        template={selected}
        onSave={handleUpdate}
      />
    </main>
  );
}

