import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const submissionDataValidator = v.any();

export const getIntakeFormById = query({
  args: { id: v.id("intakeForms") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

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

export const submitIntakeForm = mutation({
  args: {
    intakeFormId: v.id("intakeForms"),
    organizationId: v.id("organizations"),
    data: submissionDataValidator,
  },
  handler: async (ctx, { intakeFormId, organizationId, data }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const form = await ctx.db.get(intakeFormId);
    if (!form) throw new Error("Form not found");
    if (form.organizationId !== organizationId) throw new Error("Forbidden");

    const fields = form.formLayout?.fields ?? [];
    const errors: Record<string, string> = {};

    for (const f of fields) {
      const value = (data as any)?.[f.name];
      if (f.required) {
        const missing =
          value === undefined || value === null || String(value).trim() === "";
        if (missing) errors[f.name] = "Required";
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new Error("Validation failed");
    }

    const submissionId = await ctx.db.insert("submissions", {
      organizationId,
      userId,
      intakeFormId,
      data,
      formLayoutSnapshot: form.formLayout,
    });

    await ctx.db.patch(intakeFormId, {
      completions: (form.completions ?? 0) + 1,
    });

    return await ctx.db.get(submissionId);
  },
});

export const listSubmissionsByForm = query({
  args: { intakeFormId: v.id("intakeForms") },
  handler: async (ctx, { intakeFormId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_form", (q) => q.eq("intakeFormId", intakeFormId))
      .collect();
    return submissions;
  },
});
