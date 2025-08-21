"use server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

export async function deleteTicketAction(_id: Id<"tickets">) {
  await fetchMutation(api.functions.tickets.deleteByDocId, { _id });
  redirect("/dashboard/tickets");
}
