"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";
import { TableActions, TableTitle, Th } from "@/app/components/Table";
import { StatCard } from "@/app/components/StatCard";
import QRCodeStyling from "qr-code-styling";

// Example Intake page component
export default function IntakePage() {
  const [showNewIntakeModal, setShowNewIntakeModal] = useState(false);
  const [qrModalId, setQrModalId] = useState<string | null>(null);

  // Resolve org via profile -> then fetch org doc
  const profileOrg = useQuery(api.functions.profiles.getProfileOrganization, {});
  const org = useQuery(
    api.functions.organizations.getOrganizationById,
    profileOrg && profileOrg.organizationId ? { organizationId: profileOrg.organizationId } : "skip",
  );

  

  // Wait until org is loaded
  const docs = useQuery(
    api.functions.intakeForms.getIntakeFormByOrgId,
    org ? { organizationId: org._id } : "skip",
  );

  const rows = (docs ?? []) as Doc<"intakeForms">[];

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
                <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">
                  Export
                </button>
              </div>
            </div>
          </div>
          {showNewIntakeModal && (
            <NewIntakeModal onClose={() => setShowNewIntakeModal(false)} />
          )}
          {qrModalId && (
            <ViewQRModal
              id={qrModalId}
              onClose={() => setQrModalId(null)}
            />
          )}
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
                  {docs === undefined
                    ? (
                      intakeTableSkeleton()
                    )
                    : (
                      rows.map((r: Doc<"intakeForms">) => (
                        <tr key={r._id} className="hover:bg-slate-900/30">
                          <td className="px-3 py-2 text-sm text-slate-200 whitespace-nowrap font-medium">
                            #{r._id}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-200 max-w-[14rem] md:max-w-[28rem] truncate">
                            {r.formLayout.title}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                            {r.views}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                            {r.completions}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                            {r.visible ? "Yes" : "No"}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                            {new Date(r._creationTime).toLocaleDateString(
                              "en-US",
                            )}
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
                              <button
                                onClick={() =>
                                  setQrModalId(r._id)}
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

function intakeTableSkeleton() {
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

function NewIntakeModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const profileOrg = useQuery(api.functions.profiles.getProfileOrganization, {});
  const org = useQuery(
    api.functions.organizations.getOrganizationById,
    profileOrg && profileOrg.organizationId ? { organizationId: profileOrg.organizationId } : "skip",
  );
  const createIntakeForm = useMutation(
    api.functions.intakeForms.createIntakeForm,
  );
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
            "required": true,
          },
          {
            "type": "text",
            "label": "Last Name",
            "name": "lastName",
            "required": true,
          },
          {
            "type": "email",
            "label": "Email Address",
            "name": "email",
            "required": true,
          },
          {
            "type": "phone",
            "label": "Phone Number",
            "name": "phone",
            "required": false,
          },
        ],
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

function ViewQRModal({ id, onClose }: { id: string; onClose: () => void }) {
  // const [isReady, setIsReady] = useState(false);
  const qrContainerRef = React.useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = React.useRef<QRCodeStyling | null>(null);

  // Create/Update QR code
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/intake/${id}`;

    // Inline SVG logo with brand color
    // const svgLogo =
    //   `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="240" viewBox="0 0 1000 240">` +
    //   `<rect fill="transparent" width="100%" height="100%"/>` +
    //   `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="200" textLength="900" lengthAdjust="spacingAndGlyphs" font-family="Inter, Arial, sans-serif" fill="#249F73">TriageR</text>` +
    //   `</svg>`;
    // const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgLogo)}`;

    if (!qrInstanceRef.current) {
      // Initialize
      qrInstanceRef.current = new QRCodeStyling({
        width: 320,
        height: 320,
        type: "svg",
        data: url,
        margin: 0,
        qrOptions: { errorCorrectionLevel: "M" },
        dotsOptions: {
          type: "extra-rounded",
          color: "#249F73",
          roundSize: true,
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#249F73",
        },
        cornersDotOptions: {
          type: "extra-rounded",
          color: "#249F73",
        },
        backgroundOptions: {
          color: "transparent",
        },
      });
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
        qrInstanceRef.current.append(qrContainerRef.current);
        // setIsReady(true);
      }
    } else {
      // Update existing instance
      // qrInstanceRef.current.update({ data: url, image: svgDataUrl });
      // setIsReady(true);
    }

    return () => {
      // no explicit destroy API; clear container on unmount
      // if (qrContainerRef.current) qrContainerRef.current.innerHTML = "";
    };
  }, [id]);

  const handlePrint = async () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Intake Form QR Code
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Scan this QR code with your phone to start the intake form. You can
            also print this QR Code to be posted in your office/common area for
            your patients.
          </p>
        </div>
        <div className="flex items-center justify-center py-4">
          <div ref={qrContainerRef} className="rounded-2xl overflow-hidden" />
          {/* {!isReady && <div className="text-center text-sm text-slate-400">Loading...</div>} */}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 border border-slate-700 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Print
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function IconQr(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zM3 13h8v8H3v-8zm2 2v4h4v-4H5zM13 3h8v8h-8V3zm2 2v4h4V5h-4zM13 13h2v2h-2v-2zm4 0h4v2h-4v-2zm-4 4h2v4h-2v-4zm4 2h2v2h-2v-2zm4 2h-2v-2h2v2z" />
    </svg>
  );
}
