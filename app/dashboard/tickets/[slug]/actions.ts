"use server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { revalidateTickets } from "../ticketsTableServer";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

export async function deleteTicketAction(_id: Id<"tickets">) {

  await fetchMutation(api.tickets.deleteByDocId, { _id });
  await revalidateTickets();      // bust list cache
  revalidateTag(`ticket:${_id}`);  // bust detail cache
  redirect("/dashboard/tickets");
}