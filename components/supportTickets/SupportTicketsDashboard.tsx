"use client";

import { useEffect, useState } from "react";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  addTicketComment,
  uploadTicketAttachment,
  reopenOrCloseTicket,
} from "@/services/api/supportTicketsApi";
import { CreateTicketForm } from "./CreateTicketForm";
import { TicketsTable } from "./TicketsTable";
import { TicketDetailsModal } from "./TicketDetailsModal";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  createdAt: string;
  updatedAt: string;
  attachments: any[];
  comments: any[];
  history: any[];
};

export default function SupportTicketsDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTickets();
      setTickets(res.items || res || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const handleCreate = async (payload: {
    title: string;
    category: string;
    description: string;
    priority: string;
    file?: File | null;
  }) => {
    try {
      setError(null);
      const created = await createTicket({
        title: payload.title,
        category: payload.category,
        description: payload.description,
        priority: payload.priority,
      });
      if (payload.file) {
        await uploadTicketAttachment(created.id, payload.file);
      }
      await loadTickets();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create ticket");
    }
  };

  const openDetails = async (ticketId: string) => {
    try {
      setError(null);
      const t = await getTicketById(ticketId);
      setSelectedTicket(t);
      setDetailsOpen(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load ticket");
    }
  };

  const withDetailsReload = async (fn: (id: string) => Promise<any>) => {
    if (!selectedTicket) return;
    await fn(selectedTicket.id);
    const updated = await getTicketById(selectedTicket.id);
    setSelectedTicket(updated);
    await loadTickets();
  };

  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Support Tickets</h1>
          <p className="text-xs text-muted-foreground">
            Submit issues, track progress, and collaborate with support.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <p className="text-xs text-muted-foreground">Loading tickets...</p>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-4">
        <div className="space-y-3">
          <CreateTicketForm onCreate={handleCreate} />
          <TicketsTable tickets={tickets} onSelect={openDetails} />
        </div>
        <div className="space-y-3">
          {/* Right column is currently the details modal trigger; could add summary stats here later */}
          <p className="text-xs text-muted-foreground">
            Select a ticket from the list to view details, comments, and
            history.
          </p>
        </div>
      </section>

      <TicketDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        ticket={selectedTicket}
        onStatusChange={(status) =>
          withDetailsReload((id) => updateTicketStatus(id, status))
        }
        onUploadAttachment={(file) =>
          withDetailsReload((id) => uploadTicketAttachment(id, file))
        }
        onAddComment={(payload) =>
          withDetailsReload((id) => addTicketComment(id, payload))
        }
        onCloseOrReopen={(action) =>
          withDetailsReload((id) => reopenOrCloseTicket(id, action))
        }
      />
    </main>
  );
}

