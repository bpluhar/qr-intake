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
    .index("by_user", ["userId"]) // quickly find profile by auth user id
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

  /** Tickets (tenant-scoped) */
  tickets: defineTable({
    // Friendly numeric id you already use in the UI/URLs
    id: v.number(),

    // Tenant ownership
    organizationId: v.id("organizations"),

    // Relationships
    customerId: v.id("customers"), // required: ticket belongs to a customer
    companyId: v.optional(v.id("companies")), // optional: ticket may also belong to a company

    // Existing fields
    assignees: v.array(v.string()),
    created: v.string(),
    customer: v.string(),
    customer_id: v.number(),
    priority: v.string(),
    severity: v.string(),
    status: v.string(),
    title: v.string(),
  })
    // Helpful indexes for multi-tenant queries
    // .index("by_id", ["id"]) // your numeric/friendly id
    .index("by_organization", ["organizationId"]) // scope all ticket lists by org
    .index("by_customer", ["customerId"]) // look up tickets by customer
    .index("by_company", ["companyId"]), // look up tickets by company
});

export default schema;