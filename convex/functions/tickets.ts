import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tickets").collect();
  },
});

export const getByDocId = query({
  args: { _id: v.id("tickets") },
  handler: async (ctx, { _id }) => {
    return await ctx.db.get(_id);
  },
});

export const getByOrganizationId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");
    const organizationId = profile.organizationId;
    const tickets = await ctx.db
      .query("tickets")
      .withIndex(
        "by_organization",
        (q) => q.eq("organizationId", organizationId),
      )
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
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
    severity: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { title, description, priority, severity, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    const ticketId = await ctx.db.insert("tickets", {
      userId: userId, // or your own sequence logic
      organizationId: profile.organizationId,
      assignees: [userId], // string[] per schema, so cast if needed
      priority: priority ?? "P4",
      severity: severity ?? "Low",
      status: status ?? "Open",
      title,
      description: description ?? "",
    });

    return ticketId;
  },
});
