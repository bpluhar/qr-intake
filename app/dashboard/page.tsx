export const dynamic = "force-dynamic";

import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  let initialEmail: string | null = null;
  try {
    const token = await convexAuthNextjsToken();
    const user = token ? await fetchQuery(api.users.getCurrent, {}, { token }) : null;
    initialEmail = (user as any)?.email ?? null;
    console.log("User email:", initialEmail);
  } catch (err) {
    // handle error
  }

  return <DashboardClient initialEmail={initialEmail} />;
}