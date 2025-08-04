"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
    const users = useQuery(api.users.get);
    // if (!users) {
    //     return <div>Loading...</div>;
    // }
  return (
    <main className="">
      <ul key ="usersList" className="list-disc">
      {users?.map(({ _id, username, email, dob, organization}) => 
        <li key={_id} className="mb-2">
          <strong>{username}</strong> - {email} - {new Date(dob).toLocaleDateString()} - Org: {organization}
        </li>
      )}
      </ul>
    </main>
  );
}
