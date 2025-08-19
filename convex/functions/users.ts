import { query } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
// import type { Doc } from "../_generated/dataModel";

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // tokenIdentifier is typically: "<issuer>|<providerAccountId>|<sessionId>"
    const parts = identity.tokenIdentifier.split("|");

    // 1) Try resolving via sessionId -> userId (most reliable)
    if (parts.length >= 3) {
      const sessionId = parts[2] as Id<"authSessions">;
      try {
        const session = await ctx.db.get(sessionId);
        if (session) {
          const user = await ctx.db.get(session.userId as Id<"users">);
          if (user) return user;
        }
      } catch (_) {
        // ignore if not a valid Convex Id format
      }
    }

    // 2) Fallback: resolve via authAccounts(provider, providerAccountId)
    if (parts.length >= 2) {
      const providerAccountId = parts[1];
      const account = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", "password").eq("providerAccountId", providerAccountId)
        )
        .unique();
      if (account) {
        const user = await ctx.db.get(account.userId as Id<"users">);
        if (user) return user;
      }
    }

    // 3) Last fallback: if provider supplied email, look up by users.email
    if (identity.email) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .unique();
      if (user) return user;
    }

    return null;
  },
});

export const isSignedIn = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity !== null;
  },
});

export const getCurrentWithSource = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { user: null, source: "none" as const };

    const parts = identity.tokenIdentifier.split("|");

    // 1) sessionId -> userId
    if (parts.length >= 3) {
      const sessionId = parts[2] as Id<"authSessions">;
      try {
        const session = await ctx.db.get(sessionId);
        if (session) {
          const user = await ctx.db.get(session.userId as Id<"users">);
          if (user) return { user, source: "session" as const };
        }
      } catch (_) {}
    }

    // 2) account -> user
    if (parts.length >= 2) {
      const providerAccountId = parts[1];
      const account = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", "password").eq("providerAccountId", providerAccountId)
        )
        .unique();
      if (account) {
        const user = await ctx.db.get(account.userId as Id<"users">);
        if (user) return { user, source: "account" as const };
      }
    }

    // 3) email -> user
    if (identity.email) {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", identity.email!))
        .unique();
      if (user) return { user, source: "email" as const };
    }

    return { user: null, source: "none" as const };
  },
});