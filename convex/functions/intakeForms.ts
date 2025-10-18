import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";


export const getIntakeFormById = query({
  args: { id: v.id("intakeForms") },
  handler: async (ctx, { id }) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Unauthorized");
    
    const intakeForm = await ctx.db.get(id);
    return intakeForm ?? null;
  },
});

export const getIntakeFormByOrgId = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
    const intakeForms = await ctx.db
      .query("intakeForms")
      .withIndex(
        "by_organization",
        (q) => q.eq("organizationId", organizationId),
      )
      .collect();
    return intakeForms;
  },
});

export const createIntakeForm = mutation({
  args: {
    formLayout: v.object({
      title: v.string(),
      description: v.optional(v.string()),
      fields: v.optional(
        v.array(
          v.object({
            type: v.string(),
            name: v.string(),
            label: v.string(),
            placeholder: v.optional(v.string()),
            required: v.optional(v.boolean()),
            options: v.optional(
              v.array(
                v.object({
                  label: v.string(),
                  value: v.string(),
                }),
              ),
            ),
          }),
        ),
      ),
    }),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { formLayout, organizationId }) => {
    const user = await getAuthUserId(ctx);
    if (user === null) {
      throw new Error("Unauthorized");
    }

    const id = await ctx.db.insert("intakeForms", {
      formLayout,
      organizationId,
      creatorId: user,
      visible: true,
      views: 0,
      completions: 0,
    });
    const doc = await ctx.db.get(id);
    return doc;
  },
});

export const updateViewCount = mutation({
  args: { id: v.id("intakeForms") },
  handler: async (ctx, { id }) => {
    const intakeForm = await ctx.db.get(id);
    if (!intakeForm) {
      return null;
    }
    await ctx.db.patch(id, { views: (intakeForm.views ?? 0) + 1 });
    const updated = await ctx.db.get(id);
    return updated;
  },
});

export const updateIntakeForm = mutation({
  args: {
    id: v.id("intakeForms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, description }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const doc = await ctx.db.get(id);
    if (!doc) return null;

    const currentLayout = doc.formLayout ?? { title: "", description: "", fields: [] };
    const nextLayout = {
      ...currentLayout,
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
    };

    await ctx.db.patch(id, { formLayout: nextLayout });
    return await ctx.db.get(id);
  },
});

export const getIntakeMetricsByOrg = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const forms = await ctx.db
      .query("intakeForms")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    const formIds = new Set(forms.map((f) => f._id));
    const totalActiveIntakes = forms.length;

    // submissions for this org
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    // total submissions across org
    const totalSubmissions = submissions.length;

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const submissionsThisWeek = submissions.filter((s) => s._creationTime >= weekAgo).length;

    // average completion time in ms, based on timeTaken
    const times = submissions.map((s) => s.timeTaken).filter((n) => typeof n === "number") as number[];
    const avgMs = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

    return {
      totalActiveIntakes,
      totalSubmissions,
      avgCompletionMs: avgMs,
      submissionsThisWeek,
    };
  },
});