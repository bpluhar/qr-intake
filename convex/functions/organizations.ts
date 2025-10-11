// convex/functions/organizations.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc } from "../_generated/dataModel";

export const getMyCreatedOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // organizations.createdBy is v.id("users") and indexed by "by_creator"
    // schema ref: organizations.createdBy + .index("by_creator", ["createdBy"])
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_creator", (q) => q.eq("createdBy", userId))
      .first();

    return org; // Doc<"organizations"> | null
  },
});

export const createOrganization = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Create the organization with the creator set to the current user
    const org = await ctx.db.insert("organizations", {
      name: args.name,
      createdBy: userId,
      nextTicketId: 1,
    });
    
    const orgSettings = await ctx.db.insert("organizationSettings", {
      organizationId: org,
      timezone: "America/New_York",
      theme: "dark",
      emailNotifications: true,
      logo: undefined,
      defaultIntakeTitle: `${args.name} Intake Form`,
      defaultIntakeDescription: "Please fill out the following information to help us better serve you. If you have any questions please see the associate at the front desk. Thank you!",
    });

    return { org, orgSettings }; // Doc<"organizations">
  },
});

// getOrganizationSettingsById already defined below (single export)

export const getOrganizationById = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organizationId);
    return org; // Doc<"organizations"> | null
  },
});

export const getOrganizationSettingsById = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("organizationSettings")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    return settings; // Doc<"organizationSettings"> | null
  },
});

export const updateOrganizationById = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.optional(v.string()),
    nextTicketId: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Doc<"organizations"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const current = await ctx.db.get(args.organizationId);
    if (!current) return null;

    const patch: Partial<Doc<"organizations">> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.nextTicketId !== undefined) patch.nextTicketId = args.nextTicketId;

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.organizationId, patch as Doc<"organizations">);
    }

    return await ctx.db.get(args.organizationId);
  },
});

export const updateOrganizationSettingsById = mutation({
  args: {
    organizationId: v.id("organizations"),
    defaultIntakeTitle: v.optional(v.string()),
    defaultIntakeDescription: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Doc<"organizationSettings"> | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("organizationSettings")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    if (!settings) return null;

    const patch: Partial<Doc<"organizationSettings">> = {};
    if (args.defaultIntakeTitle !== undefined) {
      patch.defaultIntakeTitle = args.defaultIntakeTitle;
    }
    if (args.defaultIntakeDescription !== undefined) {
      patch.defaultIntakeDescription = args.defaultIntakeDescription;
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(settings._id, patch as Doc<"organizationSettings">);
    }

    return await ctx.db.get(settings._id);
  },
});
