import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getIntakeFormById = query({
  args: { id: v.id("intakeForms") },
  handler: async ({ db }, { id }) => {
    const intakeForm = await db.query("intakeForms").withIndex(
      "by_id",
      (q) => q.eq("_id", id),
    ).unique();
    return intakeForm ?? null;
  },
});

export const getIntakeFormByOrgId = query({
  args: { organizationId: v.id("organizations") },
  handler: async ({ db }, { organizationId }) => {
    const intakeForms = await db
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
  handler: async ({ db }, { id }) => {
    const intakeForm = await db.get(id);
    if (!intakeForm) {
      return null;
    }
    await db.patch(id, { views: (intakeForm.views ?? 0) + 1 });
    const updated = await db.get(id);
    return updated;
  },
});
