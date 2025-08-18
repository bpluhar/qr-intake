import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Multi-tenant schema
 * - organizations: one row per org (created during onboarding)
 * - profiles: one row per user, points to organizations._id
 * - customers: tenant-scoped contacts
 * - companies: tenant-scoped companies, each with a primary contact (customer _id)
 * - tickets: tenant-scoped tickets belonging to a customer and optionally a company
 */
const schema = defineSchema({
  ...authTables,

  /** Organizations (tenant) */
  organizations: defineTable({
    name: v.string(),
    // creator is the auth user that created the org on onboarding
    createdBy: v.id("users"),
  })
    .index("by_creator", ["createdBy"]) // useful if you want to find orgs a user created
    .index("by_name", ["name"]),

  /** Per-user profile, links an auth user to an organization */
  profiles: defineTable({
    userId: v.id("users"),
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(), // duplicate of auth user for convenience/lookups
    phone: v.optional(v.string()),
  })
    .index("by_userId", ["userId"]) // quickly find profile by auth user id
    .index("by_organization", ["organizationId"]),

  /** Customers (tenant-scoped) */
  customers: defineTable({
    organizationId: v.id("organizations"),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
  })
    .index("by_organization", ["organizationId"]) // list/search within org
    .index("by_email", ["email"]),

  /** Companies (tenant-scoped) */
  companies: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    // Primary contact in this org's customer list
    contactCustomerId: v.id("customers"),
  })
    .index("by_organization", ["organizationId"]) // list within org
    .index("by_name", ["name"]),

  /** Organization-level settings */
  organizationSettings: defineTable({
    organizationId: v.id("organizations"), // correlates via organizations._id
    timezone: v.optional(v.string()),
    theme: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
  }).index("by_organization", ["organizationId"]),

  /** Company-level settings */
  companySettings: defineTable({
    companyId: v.id("companies"), // correlates via companies._id
    slaHours: v.optional(v.number()),
    autoAssign: v.optional(v.boolean()),
    note: v.optional(v.string()),
  }).index("by_company", ["companyId"]),

  /** User-level settings (auth users) */
  userSettings: defineTable({
    userId: v.id("users"), // link to auth user
    theme: v.optional(v.string()),
    firstDayOfWeek: v.optional(v.number()), // 0-6
    emailNotifications: v.optional(v.boolean()),
    whatsNewDismissed: v.optional(v.boolean()), // track if user dismissed "What's New" banner
    welcomeDismissed: v.optional(v.boolean()), // track if user dismissed welcome banner
  }).index("by_userId", ["userId"]),

  /** Tickets (tenant-scoped) */
  tickets: defineTable({
    // Friendly numeric id you already use in the UI/URLs
    userId: v.id("users"), // auth user that created the ticket

    // Tenant ownership
    organizationId: (v.id("organizations")),

    // Relationships
    customerId: v.optional(v.id("customers")), // optional: ticket belongs to a customer
    companyId: v.optional(v.id("companies")), // optional: ticket may also belong to a company

    description: v.optional(v.string()), // optional description field

    // Existing fields
    assignees: v.array(v.string()),
    priority: v.string(),
    severity: v.string(),
    status: v.string(),
    title: v.string(),
  })
    // Helpful indexes for multi-tenant queries
    // .index("by_id", ["id"]) // your numeric/friendly id
    .index("by_userId", ["userId"]) // find tickets by creator
    .index("by_organization", ["organizationId"]) // scope all ticket lists by org
    .index("by_customer", ["customerId"]) // look up tickets by customer
    .index("by_company", ["companyId"]), // look up tickets by company


  intakeForms: defineTable({
  organizationId: v.optional(v.id("organizations")),
  creatorId: v.optional(v.id("users")),
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
})
  .index("by_organization", ["organizationId"])
  .index("by_creator", ["creatorId"]),

});



export default schema;