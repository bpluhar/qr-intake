"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignIn } from "./SignIn";
import Dashboard from "./dashboard/page";
import Link from "next/link";
// import { SignOut } from "./SignOut";
 

export default function Home() {
  return (
    <main className="">
      <h1>Welcome to Triager</h1>
      
      <Link href="/dashboard">Go to Dashboard</Link>
    </main>
  );
}
 