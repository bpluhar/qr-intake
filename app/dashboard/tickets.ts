import type { Id } from "@/convex/_generated/dataModel";

export type TicketRow = {
  _id: Id<"tickets">;
  _creationTime: number;
  userId: Id<"users">; // Auth user that created the ticket
  customerId?: Id<"customers">; // Customer associated with the ticket
  title: string;
  description?: string; // Optional description field
  severity: string;
  organizationId: Id<"organizations">;
  priority: string;
  status: string;
  assignees: string[];
};