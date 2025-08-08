// convex/functions/organizations.ts
import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMyOrganization = query({
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