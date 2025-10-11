// convex/functions/organizations.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

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

export const getOrganizationSettingsById = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const orgSettings = await ctx.db
      .query("organizationSettings")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .first();
    return orgSettings; // Doc<"organizationSettings"> | null
  },
});

export const getOrganizationById = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organizationId);
    return org; // Doc<"organizations"> | null
  },
});
