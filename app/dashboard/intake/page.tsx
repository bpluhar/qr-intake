"use client";
import React, { useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";
import { TableActions, TableTitle, Th } from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";

function NewIntakeModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-slate-900 p-6 shadow-lg w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold text-slate-100">New Intake</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Add save logic here
            onClose();
          }}
        >
          <label className="block mb-2 text-sm font-medium text-slate-300">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </label>
          <label className="block mb-4 text-sm font-medium text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full resize-none rounded border border-slate-700 bg-slate-800 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-200 font-semibold hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 focus:ring-offset-[#0b1217] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#0b1217] transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Example Intake page component
export default function IntakePage() {
  const [showNewModal, setShowNewModal] = useState(false);

  // Query for organization
  const org = useQuery(api.functions.organizations.getMyOrganization, {});

  // Wait until org is loaded
  const docs = useQuery(
    api.functions.intakeForms.getIntakeFormByOrgId,
    org ? { organizationId: org._id } : "skip"
  );

  // if (org === undefined) {
  //   // Still loading org
  //   return <div>Loading...</div>;
  // }

  // if (org === null) {
  //   // User has no org
  //   return <div>No organization found.</div>;
  // }

  // if (docs === undefined) {
  //   // Intake forms still loading
  //   return <div>Loading forms...</div>;
  // }

  const rows = docs ?? [];

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8">
          {/* Breadcrumbs/title section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <button
                onClick={() => setShowNewModal(true)}
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
              >
                New
              </button>
            </div>
          </div>
          {showNewModal && <NewIntakeModal onClose={() => setShowNewModal(false)} />}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
            <StatCard label="Open intakes" value="12" delta="12" />
            <StatCard label="New this week" value="7" delta="7" />
            <StatCard label="Avg process" value="3d 5h" delta="3d 5h" />
            <StatCard label="Completed this month" value="22" delta="22" />
          </div>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TableTitle>Intake Tickets</TableTitle>
              <TableActions />
            </div>
            <div className="mt-4 overflow-x-auto md:overflow-visible rounded-md border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-400">
                  <tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    <Th>Created</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r: any) => (
                    <tr key={r._id} className="hover:bg-slate-900/30">
                      <td className="px-3 py-2 text-sm text-slate-200 whitespace-nowrap font-medium">#{r._id}</td>
                      <td className="px-3 py-2 text-sm text-slate-200 max-w-[14rem] md:max-w-[28rem] truncate">{r.formLayout.title}</td>
                      <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                        {new Date(r._creationTime).toLocaleDateString("en-US")}
                      </td>
                      <td className="px-3 py-2 text-sm text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/intake/${r._id}`}
                            target="_blank"
                            className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}