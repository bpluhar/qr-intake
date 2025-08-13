import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import TicketsTableClient from "./ticketsTableClient";
import { TicketRow } from "../tickets";

async function _getTicketsFromConvex(): Promise<TicketRow[]> {
  const docs = await fetchQuery(api.functions.tickets.getAll, {});
  const rows = (docs as TicketRow[]).map((d) => ({
    _id: d._id,
    _creationTime: d._creationTime,
    id: d.id,
    customer_id: d.customer_id,
    customer: d.customer,
    title: d.title,
    severity: d.severity as TicketRow["severity"],
    priority: d.priority as TicketRow["priority"],
    status: d.status as TicketRow["status"],
    created: d.created,
    assignees: d.assignees,
  })) as TicketRow[];
  return rows;
}

// Cache the Convex query for 60s and tag it so mutations can invalidate
export const getTicketsFromConvex = unstable_cache(
  _getTicketsFromConvex,
  ["tickets:getAll"],
  { revalidate: 120, tags: ["tickets"] }
);

// Call this from a Server Action after a Convex mutation to bust the cache
export async function revalidateTickets() {
  revalidateTag("tickets");
}

export async function TicketsTableShell() {
  // const tickets = await getTicketsFromConvex(); // server-only call
  return <TicketsTableClient />;
}