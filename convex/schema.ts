import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  tickets: defineTable({
    assignees: v.array(v.string()),
    created: v.string(),
    customer: v.string(),
    customer_id: v.number(),
    id: v.number(),
    priority: v.string(),
    severity: v.string(),
    status: v.string(),
    title: v.string(),
  }),
});
 
export default schema;