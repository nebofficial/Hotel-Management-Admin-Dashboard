"use client";

import { Dialog } from "@/components/ui/dialog";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { TicketStatusTracker } from "./TicketStatusTracker";
import { TicketAttachments } from "./TicketAttachments";
import { TicketComments } from "./TicketComments";
import { TicketHistoryTimeline } from "./TicketHistoryTimeline";
import { Button } from "@/components/ui/button";

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onStatusChange: (status: string) => Promise<void>;
  onUploadAttachment: (file: File) => Promise<void>;
  onAddComment: (payload: { message: string; internal?: boolean }) => Promise<void>;
  onCloseOrReopen: (action: "close" | "reopen") => Promise<void>;
};

export function TicketDetailsModal({
  open,
  onOpenChange,
  ticket,
  onStatusChange,
  onUploadAttachment,
  onAddComment,
  onCloseOrReopen,
}: Props) {
  if (!ticket) return null;

  const handleResolve = () => onStatusChange("Resolved");
  const handleClose = () => onCloseOrReopen("close");
  const handleReopen = () => onCloseOrReopen("reopen");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-5xl max-h-[90vh] overflow-auto rounded-xl bg-background shadow-lg border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <p className="text-sm font-semibold">
                {ticket.title}{" "}
                <span className="text-xs text-muted-foreground">
                  · {ticket.category}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Created {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TicketPriorityBadge priority={ticket.priority} />
              <Button size="sm" variant="outline" onClick={handleResolve}>
                Mark Resolved
              </Button>
              {ticket.status === "Closed" ? (
                <Button size="sm" onClick={handleReopen}>
                  Reopen
                </Button>
              ) : (
                <Button size="sm" variant="destructive" onClick={handleClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)] gap-3 p-4">
            <div className="space-y-3">
              <TicketStatusTracker status={ticket.status} />
              <div className="rounded-md border border-border bg-card p-3 text-xs space-y-1.5">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
              <TicketAttachments
                ticketId={ticket.id}
                attachments={ticket.attachments || []}
                onUpload={onUploadAttachment}
              />
            </div>
            <div className="space-y-3">
              <TicketComments
                comments={ticket.comments || []}
                onAddComment={onAddComment}
              />
              <TicketHistoryTimeline history={ticket.history || []} />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

