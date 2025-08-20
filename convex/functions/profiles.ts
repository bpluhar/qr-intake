// convex/functions/profiles.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../_generated/dataModel";

/**
 * Returns the current user's profile's organizationId.
 * If the user is not authenticated or has no profile, returns { organizationId: null }.
 */
export const getProfileOrganization = query({
  args: {},
  handler: async (
    ctx,
  ): Promise<{ organizationId: Id<"organizations"> | null }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { organizationId: null };

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return { organizationId: profile?.organizationId ?? null };
  },
});

/**
 * Fetch a profile by its userId (v.id("users")).
 * Returns the profile document or null if missing.
 */
export const getProfileByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<Doc<"profiles"> | null> => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    return profile ?? null;
  },
});

export const getProfilesByUserIds = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, { userIds }) => {
    return await Promise.all(
      userIds.map((userId) =>
        ctx.db.query("profiles").withIndex(
          "by_userId",
          (q) => q.eq("userId", userId),
        ).unique()
      ),
    ).then((results) => results.filter(Boolean));
  },
});

/**
 * Fetch a profile by its document _id (v.id("profiles")).
 * Returns the profile document or null if missing.
 */
export const getProfileByDocId = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args): Promise<Doc<"profiles"> | null> => {
    const profile = await ctx.db.get(args.profileId);
    return profile ?? null;
  },
});

/**
 * Create a profile by copying fields from the `users` table and attaching an organizationId.
 * - Enforces one profile per user (reuses the existing profile if found).
 * - Derives first/last name from users.name or from the email local-part as a fallback.
 */
export const createProfile = mutation({
  args: {
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"profiles">> => {
    // Reuse existing profile if present
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) return existing._id;

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const email = (user as any).email ?? "";
    if (!email) throw new Error("User is missing an email address");

    // Derive names
    let firstName = args.firstName ?? "";
    let lastName = args.lastName ?? "";
    if (!firstName && !lastName) {
      const fullName: string = ((user as any).name ?? "").trim();
      if (fullName) {
        const parts = fullName.split(/\s+/);
        firstName = parts[0] ?? "";
        lastName = parts.slice(1).join(" ");
      } else {
        firstName = email.split("@")[0];
      }
    }

    const phone: string | undefined = (user as any).phone ?? undefined;

    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      organizationId: args.organizationId,
      firstName,
      lastName,
      email,
      ...(phone ? { phone } : {}),
    });

    return profileId;
  },
});

/**
 * Update a profile document by its _id. Only patches fields provided in args.
 */
export const updateProfileById = mutation({
  args: {
    profileId: v.id("profiles"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args): Promise<Doc<"profiles"> | null> => {
    const current = await ctx.db.get(args.profileId);
    if (!current) return null;

    const patch: Partial<Doc<"profiles">> = {};
    if (args.firstName !== undefined) patch.firstName = args.firstName;
    if (args.lastName !== undefined) patch.lastName = args.lastName;
    if (args.email !== undefined) patch.email = args.email;
    if (args.phone !== undefined) patch.phone = args.phone;
    if (args.organizationId !== undefined) {
      patch.organizationId = args.organizationId;
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.profileId, patch as Doc<"profiles">);
    }

    return await ctx.db.get(args.profileId);
  },
});

export const generateProfilePictureUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveProfilePicture = mutation({
  args: {
    storageId: v.id("_storage"),
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args): Promise<Doc<"profiles">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const profile = await ctx.db.get(args.profileId);
    if (!profile) throw new Error("Profile not found");

    if (profile.userId !== userId) {
      throw new Error("Not authorized to modify this profile");
    }

    await ctx.db.patch(
      args.profileId,
      { profilePicture: args.storageId } as Doc<"profiles">,
    );

    const updated = await ctx.db.get(args.profileId);
    return updated as Doc<"profiles">;
  },
});