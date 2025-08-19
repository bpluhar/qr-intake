"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";
import { TableActions, TableTitle, Th } from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";
import QRCode from "qrcode";

// Example Intake page component
export default function IntakePage() {
  const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
  const [qrModalId, setQrModalId] = useState<string | null>(null);

  // Query for organization
  const org = useQuery(api.functions.organizations.getMyOrganization, {});

  // Wait until org is loaded
  const docs = useQuery(
    api.functions.intakeForms.getIntakeFormByOrgId,
    org ? { organizationId: org._id } : "skip"
  );

  const rows = docs ?? [];

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8">
          {/* Breadcrumbs/title section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
             
              <div className="flex items-center gap-2">
                <button
                onClick={() => setShowNewIntakeModal(true)}
                className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
                >
                New
                </button>
                <button
                className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
                >
                Export
                </button>
              </div>

              
            </div>
          </div>
          {showNewIntakeModal && <NewIntakeModal onClose={() => setShowNewIntakeModal(false)} />}
          {qrModalId && <ViewQRModal id={qrModalId} onClose={() => setQrModalId(null)} />}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
            <StatCard label="Open intakes" value="12" delta="12" />
            <StatCard label="New this week" value="7" delta="7" />
            <StatCard label="Avg process" value="3d 5h" delta="3d 5h" />
            <StatCard label="Completed this month" value="22" delta="22" />
          </div>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TableTitle>Intake Forms</TableTitle>
              <TableActions />
            </div>
            <div className="mt-4 overflow-x-auto md:overflow-visible rounded-md border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-400">
                  <tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    <Th>Views</Th>
                    <Th>Completions</Th>
                    <Th>Visible</Th>
                    <Th>Created</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {docs === undefined ? (
                    intakeTableSkeleton()
                  ) : (
                    rows.map((r: any) => (
                      <tr key={r._id} className="hover:bg-slate-900/30">
                        <td className="px-3 py-2 text-sm text-slate-200 whitespace-nowrap font-medium">#{r._id}</td>
                        <td className="px-3 py-2 text-sm text-slate-200 max-w-[14rem] md:max-w-[28rem] truncate">{r.formLayout.title}</td>
                        <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">{r.views}</td>
                        <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">{r.completions}</td>
                        <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">{r.visible ? "Yes" : "No"}</td>
                        <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">{new Date(r._creationTime).toLocaleDateString("en-US")}</td>
                        <td className="px-3 py-2 text-sm text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/intake/${r._id}`}
                              target="_blank"
                              className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => setQrModalId(r._id)}
                              className="inline-flex items-center justify-center rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                              aria-label="View QR"
                            >
                              <IconQr className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export function intakeTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="hover:bg-slate-900/30">
          <td className="px-3 py-2">
            <div className="h-4 w-70 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-15 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-12 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-16 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-10 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-24 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2 text-right">
            <div className="ml-auto h-6 w-16 rounded bg-emerald-400/40 animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function NewIntakeModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const org = useQuery(api.functions.organizations.getMyOrganization, {});
  const createIntakeForm = useMutation(api.functions.intakeForms.createIntakeForm);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIntakeForm({
      formLayout: {
        title: title,
        description: description,
        fields: [
        {
          "type": "text",
          "label": "First Name",
          "name": "firstName",
          "required": true
        },
        {
          "type": "text",
          "label": "Last Name",
          "name": "lastName",
          "required": true
        },
        {
          "type": "email",
          "label": "Email Address",
          "name": "email",
          "required": true
        },
        {
          "type": "phone",
          "label": "Phone Number",
          "name": "phone",
          "required": false
        }
      ]
      },
      organizationId: org!._id,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">New Intake</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217] resize-y"
              placeholder="Enter description"
            />
          </div>
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}