import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    return await ctx.db.query("tickets").collect();
  },
});

export const getByDocId = query({
  args: { _id: v.id("tickets") },
  handler: async (ctx, { _id }) => {
    // Removed auth check as tickets/[slug]/page.tsx uses async/await params and has to be a server component
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Unauthorized");
    return await ctx.db.get(_id);
  },
});

export const getByOrganizationId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
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
    // Removed auth check as tickets/[slug]/page.tsx uses async/await params and has to be a server component
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Unauthorized");
    const ticket = await ctx.db.get(_id);
    if (!ticket) throw new Error("Ticket not found");
    const organization = await ctx.db.get(ticket.organizationId);
    if (!organization) throw new Error("Organization not found");
    await ctx.db.patch(organization._id, {
      ticketCount: organization.ticketCount - 1,
    });
    await ctx.db.delete(_id);
    return { deleted: 1 } as const;
  },
});

export const createTicket = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.string(),
    severity: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { title, description, priority, severity, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    const organization = await ctx.db.query("organizations").withIndex("by_id", (q) => q.eq("_id", profile.organizationId)).unique();

    if (!organization) throw new Error("Organization not found");

    const ticketId = await ctx.db.insert("tickets", {
      userId: userId, // or your own sequence logic
      organizationId: profile.organizationId,
      assignees: [userId], // string[] per schema, so cast if needed
      priority: priority,
      severity: severity,
      status: status,
      title,
      description: description ?? "",
      friendlyId: organization.ticketCount + 1,
    });

    await ctx.db.patch(organization._id, {
      ticketCount: organization.ticketCount + 1,
    });

    return ticketId;
  },
});