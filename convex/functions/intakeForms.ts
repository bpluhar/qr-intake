import { mutation } from "../_generated/server";

import { query } from "../_generated/server";
import { v } from "convex/values";

export const getIntakeFormById = query({
  args: { id: v.id("intakeForms") },
  handler: async ({ db }, { id }) => {
    const intakeForm = await db.query("intakeForms").withIndex("by_id", (q) => q.eq("_id", id)).unique();
    return intakeForm ?? null;
  }
});

export const getIntakeFormByOrgId = query({
  args: { organizationId: v.id("organizations") },
  handler: async ({ db }, { organizationId }) => {
    const intakeForms = await db.query("intakeForms").filter(q => q.eq(q.field("organizationId"), organizationId)).collect();
    return intakeForms;
  }
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
                })
              )
            ),
          })
        )
      ),
    }),
    organizationId: v.optional(v.id("organizations")),
    creatorId: v.optional(v.id("users")),
  },
  handler: async (ctx, { formLayout, organizationId, creatorId }) => {
    const id = await ctx.db.insert("intakeForms", {
      formLayout,
      organizationId,
      creatorId,
    });
    const doc = await ctx.db.get(id);
    return doc;
  },
});
