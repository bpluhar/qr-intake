import { mutation, query } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserSettingsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }): Promise<Doc<"userSettings"> | null> => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");
    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    return settings ?? null;
  },
});

export const dismissWhatsNew = mutation({
  args: { id: v.id("userSettings") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    await ctx.db.patch(id, {
      whatsNewDismissed: true,
    });
  },
});

export const getWhatsNew = query({
  args: {},
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");
    const whatsNew = await ctx.db.query("whatsNew").collect();
    return whatsNew;
  },
});

export const createUserSettings = mutation({
  args: {
    userId: v.id("users"),
    theme: v.optional(v.string()),
    firstDayOfWeek: v.optional(v.number()),
    emailNotifications: v.optional(v.boolean()),
    whatsNewDismissed: v.optional(v.boolean()),
    welcomeDismissed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existingSettings) {
      return existingSettings;
    }
    const id = await ctx.db.insert("userSettings", {
      userId: args.userId,
      theme: args.theme,
      firstDayOfWeek: args.firstDayOfWeek,
      emailNotifications: args.emailNotifications,
      whatsNewDismissed: args.whatsNewDismissed,
      welcomeDismissed: args.welcomeDismissed,
    });
    return id;
  },
});
