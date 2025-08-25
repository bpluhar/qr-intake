import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  organizations: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    ticketCount: v.number(),

  })
    .index("by_creator", ["createdBy"])
    .index("by_name", ["name"]),

  profiles: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    profilePicture: v.optional(v.id("_storage")),
  })
    .index("by_userId", ["userId"])
    .index("by_organization", ["organizationId"]),

  customers: defineTable({
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"]),

  companies: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    contactCustomerId: v.id("customers"),
  })
    .index("by_organization", ["organizationId"])
    .index("by_name", ["name"]),

  organizationSettings: defineTable({
    organizationId: v.id("organizations"),
    timezone: v.optional(v.string()),
    theme: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
  }).index("by_organization", ["organizationId"]),

  companySettings: defineTable({
    companyId: v.id("companies"),
    slaHours: v.optional(v.number()),
    autoAssign: v.optional(v.boolean()),
    note: v.optional(v.string()),
  }).index("by_company", ["companyId"]),

  userSettings: defineTable({
    userId: v.id("users"),
    theme: v.optional(v.string()),
    firstDayOfWeek: v.optional(v.number()),
    emailNotifications: v.optional(v.boolean()),
    whatsNewDismissed: v.optional(v.boolean()),
    welcomeDismissed: v.optional(v.boolean()),
  }).index("by_userId", ["userId"]),

  whatsNew: defineTable({
    version: v.string(),
    title: v.string(),
    description: v.string(),
    updates: v.array(v.object({
      title: v.string(),
      description: v.string(),
      emoji: v.string(),
    })),
  }),

  tickets: defineTable({
    userId: v.id("users"),
    organizationId: (v.id("organizations")),
    customerId: v.optional(v.id("customers")),
    companyId: v.optional(v.id("companies")),
    description: v.optional(v.string()),
    assignees: v.array(v.string()),
    priority: v.string(),
    severity: v.string(),
    status: v.string(),
    title: v.string(),
    friendlyId: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_customer", ["customerId"])
    .index("by_company", ["companyId"]),

  intakeForms: defineTable({
    organizationId: v.id("organizations"),
    creatorId: v.id("users"),
    visible: v.boolean(),
    views: v.number(),
    completions: v.number(),
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
  })
    .index("by_organization", ["organizationId"])
    .index("by_creator", ["creatorId"]),
});

export default schema;
