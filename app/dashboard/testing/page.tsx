"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {

const result = useQuery(api.functions.users.getCurrentWithSource);

if (result === undefined) return "Loading…";
if (result === null) return "Unexpected null"; // shouldn't happen in this query

return (
  <pre className="whitespace-pre-wrap break-all text-sm py-0 lg:py-8">
    {JSON.stringify(result, null, 2)}
  </pre>
);

}