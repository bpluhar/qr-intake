import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const submissionDataValidator = v.any();

export const submitIntakeForm = mutation({
  args: {
    intakeFormId: v.id("intakeForms"),
    organizationId: v.id("organizations"),
    data: submissionDataValidator,
    timeTaken: v.optional(v.number()),
    uid: v.optional(v.string()),
  },
  handler: async (ctx, { intakeFormId, organizationId, data, timeTaken, uid }) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Unauthorized");

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
      throw new Error("Validation failed: " + JSON.stringify(errors));
    }

    const submissionId = await ctx.db.insert("submissions", {
      organizationId,
      intakeFormId,
      data,
      timeTaken,
      uid,
      status: "pending",
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

export const getSubmissionByFormAndUid = query({
  args: { intakeFormId: v.id("intakeForms"), uid: v.string() },
  handler: async (ctx, { intakeFormId, uid }) => {
    // Anonymous lookup allowed for public intake status by uid

    const s = await ctx.db
      .query("submissions")
      .withIndex("by_form_uid", (q) => q.eq("intakeFormId", intakeFormId).eq("uid", uid))
      .unique();
    return s ?? null;
  },
});

export const listSubmissionsByOrg = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    const formIdSet = new Set(submissions.map((s) => s.intakeFormId));
    const formIdToTitle = new Map<string, string>();
    await Promise.all(
      Array.from(formIdSet).map(async (fid) => {
        const f = await ctx.db.get(fid);
        if (f) formIdToTitle.set(fid, f.formLayout?.title ?? "");
      }),
    );

    return submissions.map((s) => ({
      _id: s._id,
      _creationTime: s._creationTime,
      intakeFormId: s.intakeFormId,
      formTitle: formIdToTitle.get(s.intakeFormId) ?? "",
      status: s.status ?? "",
      data: s.data,
      formLayoutSnapshot: s.formLayoutSnapshot,
    }));
  },
});

export const updateSubmissionById = mutation({
  args: {
    id: v.id("submissions"),
    data: v.any(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { id, data, status }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const s = await ctx.db.get(id);
    if (!s) throw new Error("Submission not found");

    const patch: any = { data };
    if (status !== undefined) patch.status = status;
    await ctx.db.patch(id, patch);
    return await ctx.db.get(id);
  },
});

export const deleteSubmissionById = mutation({
  args: { id: v.id("submissions") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    await ctx.db.delete(id);
    return true;
  },
});