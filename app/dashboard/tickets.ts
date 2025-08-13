import type { Id } from "@/convex/_generated/dataModel";

export type TicketRow = {
  _id: Id<"tickets">;
  _creationTime: number;
  id: number;
  customer_id: number;
  customer: string;
  title: string;
  description?: string; // Optional description field
  severity: string;
  organizationId: Id<"organizations">;
  priority: string;
  status: string;
  created: string;
  assignees: string[];
};