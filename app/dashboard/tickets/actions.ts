"use server";

import { revalidateTickets } from "./ticketsTableServer";

export async function refreshTickets() {
  await revalidateTickets();
}
