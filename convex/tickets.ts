import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

export const deleteByDocId = mutation({
  args: { _id: v.id("tickets") },
  handler: async (ctx, { _id }) => {
    await ctx.db.delete(_id);
    return { deleted: 1 } as const;
  },
});
