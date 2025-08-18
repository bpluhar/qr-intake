import { query } from "../_generated/server";
import { v } from "convex/values";

export const getIntakeFormById = query({
  args: { id: v.id("intakeForms") },
  handler: async ({ db }, { id }) => {
    const intakeForm = await db.query("intakeForms").withIndex("by_id", (q) => q.eq("_id", id)).unique();
    return intakeForm ?? null;
  }
});


