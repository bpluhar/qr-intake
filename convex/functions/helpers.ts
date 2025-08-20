import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const deleteUserData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const organizations = await ctx.db.query("organizations").withIndex(
      "by_creator",
      (q) => q.eq("createdBy", userId),
    ).collect();

    for (const org of organizations) {
      await ctx.db.delete(org._id);
    }

    const profiles = await ctx.db.query("profiles").withIndex(
      "by_userId",
      (q) => q.eq("userId", userId),
    ).collect();

    for (const profile of profiles) {
      if (profile.profilePicture) {
        await ctx.storage.delete(profile.profilePicture);
      }
      await ctx.db.delete(profile._id);
    }

    const tickets = await ctx.db.query("tickets").withIndex(
      "by_userId",
      (q) => q.eq("userId", userId),
    ).collect();

    for (const ticket of tickets) {
      await ctx.db.delete(ticket._id);
    }

    const userSettings = await ctx.db.query("userSettings").withIndex(
      "by_userId",
      (q) => q.eq("userId", userId),
    ).collect();

    for (const setting of userSettings) {
      await ctx.db.delete(setting._id);
    }

    return {
      organizationsDeleted: organizations.length,
      profilesDeleted: profiles.length,
      ticketsDeleted: tickets.length,
      userSettingsDeleted: userSettings.length,
    };
  },
});
