import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    // Fetch tickets from the database
    return await ctx.db.query("tickets").collect();
  },
});

export const getById = query({
  args: { id: v.number() },
  handler: async (ctx, { id }) => {
    // Guard against NaN / Infinity even though validator is number
    if (!Number.isFinite(id)) return null;

    // Requires schema index: defineTable(...).index("by_id", ["id"]) on "tickets"
    const doc = await ctx.db
      .query("tickets")
      .withIndex("by_ticket_id", (q) => q.eq("id", id))
      .first();

    return doc; // Doc or null
  },
});

export const deleteById = mutation({
  args: { id: v.number() },
  handler: async (ctx, { id }) => {
    if (!Number.isFinite(id)) return { deleted: 0 };

    const doc = await ctx.db
      .query("tickets")
      .withIndex("by_ticket_id", (q) => q.eq("id", id))
      .first();

    if (!doc?._id) return { deleted: 0 };

    await ctx.db.delete(doc._id);
    return { deleted: 1 };
  },
});

