import type { Id } from "@/convex/_generated/dataModel";

export type TicketRow = {
  _id: Id<"tickets">;
  _creationTime: number;
  id: number;
  customer_id: number;
  customer: string;
  title: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "P1" | "P2" | "P3" | "P4";
  status: "Open" | "Pending" | "Resolved";
  created: string;
  assignees: string[];
};