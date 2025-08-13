import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    // Fetch tickets from the database
    return await ctx.db.query("tickets").collect();
  },
});



// export const getById = query({
//   args: { id: v.number() },
//   handler: async (ctx, { id }) => {
//     // Guard against NaN / Infinity even though validator is number
//     if (!Number.isFinite(id)) return null;

//     const doc = await ctx.db
//       .query("tickets")
//       .withIndex("by_id", (q) => q.eq("id", id))
//       .first();

//     return doc; // Doc or null
//   },
// });

// export const deleteById = mutation({
//   args: { id: v.number() },
//   handler: async (ctx, { id }) => {
//     if (!Number.isFinite(id)) return { deleted: 0 };

//     const doc = await ctx.db
//       .query("tickets")
//       .withIndex("by_id", (q) => q.eq("id", id))
//       .first();

//     if (!doc?._id) return { deleted: 0 };

//     await ctx.db.delete(doc._id);
//     return { deleted: 1 };
//   },
// });

export const getByDocId = query({
  args: { _id: v.id("tickets") },
  handler: async (ctx, { _id }) => {
    return await ctx.db.get(_id);
  },
});

export const getByOrganizationId = query({
  args: { },
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");
    const organizationId = profile.organizationId;
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_organization", q => q.eq("organizationId", organizationId))
      .collect();
    return tickets;
  },
});

export const deleteByDocId = mutation({
  args: { _id: v.id("tickets") },
  handler: async (ctx, { _id }) => {
    await ctx.db.delete(_id);
    return { deleted: 1 } as const;
  },
});

export const createTicket = mutation({
  args: {
    title: v.string(),
    priority: v.optional(v.string()),
    severity: v.optional(v.string()),
    status: v.optional(v.string())
  },
  handler: async (ctx, { title, priority, severity, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    const ticketId = await ctx.db.insert("tickets", {
      id: Date.now(), // or your own sequence logic
      organizationId: profile.organizationId,
      assignees: [userId], // string[] per schema, so cast if needed
      created: new Date().toISOString(),
      customer: "Unassigned", // placeholder until linked
      customer_id: 0, // placeholder until linked
      priority: priority ?? "P1",
      severity: severity ?? "Low Severity",
      status: status ?? "Open",
      title
    });

    return ticketId;
  }
});
