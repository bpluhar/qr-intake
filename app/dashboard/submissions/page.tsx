"use client";
import React from "react";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";
import { TableActions, TableTitle, Th } from "@/app/components/Table";
import type { Id } from "@/convex/_generated/dataModel";

type FieldOption = { label: string; value: string };
type FieldSpec = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
};

type SubmissionListItem = {
  _id: Id<"submissions">;
  _creationTime: number;
  intakeFormId: string;
  formTitle: string;
  status?: string;
  uid?: string;
  data: Record<string, unknown>;
  formLayoutSnapshot?: {
    fields?: FieldSpec[];
  };
};

export default function SubmissionsPage() {
  const profileOrg = useQuery(api.functions.profiles.getProfileOrganization, {});
  const org = useQuery(
    api.functions.organizations.getOrganizationById,
    profileOrg && profileOrg.organizationId ? { organizationId: profileOrg.organizationId } : "skip",
  );
  const subs = useQuery(
    api.functions.submissions.listSubmissionsByOrg,
    org ? { organizationId: org._id } : "skip",
  ) as SubmissionListItem[] | undefined;

  const updateSubmission = useMutation(api.functions.submissions.updateSubmissionById);
  const [editing, setEditing] = React.useState<SubmissionListItem | null>(null);
  const [editValues, setEditValues] = React.useState<Record<string, string>>({});
  const [editStatus, setEditStatus] = React.useState<string | undefined>(undefined);

  const startEdit = (row: SubmissionListItem) => {
    setEditing(row);
    const init: Record<string, string> = {};
    if (row.data) {
      for (const [k, v] of Object.entries(row.data)) {
        init[k] = v == null ? "" : String(v);
      }
    }
    setEditValues(init);
    setEditStatus(row.status ?? "");
  };
  const closeEdit = () => {
    setEditing(null);
    setEditValues({});
    setEditStatus(undefined);
  };
  const saveEdit = async () => {
    if (!editing) return;
    await updateSubmission({ id: editing._id, data: editValues, status: editStatus });
    closeEdit();
  };

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <Breadcrumbs />
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700">
                  Export
                </button>
              </div>
            </div>
          </div>

          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TableTitle>Submissions</TableTitle>
              <TableActions />
            </div>
            <div className="mt-4 overflow-x-auto md:overflow-visible rounded-md border border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/60 text-slate-400">
                  <tr>
                    <Th>Full Name</Th>
                    <Th>Form Title</Th>
                    <Th>Submission Date</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {subs === undefined ? (
                    submissionTableSkeleton()
                  ) : (
                  (subs ?? []).map((s) => (
                      <tr key={s._id} className="hover:bg-slate-900/30">
                        <td className="px-3 py-2 text-sm text-slate-200 whitespace-nowrap">
                          {`${String(s.data?.firstName ?? "").trim()} ${String(s.data?.lastName ?? "").trim()}`.trim() || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-200 whitespace-nowrap max-w-[24rem] truncate">
                          {s.formTitle || "—"}
                        </td>
                        <td className="px-3 py-2 text-sm text-slate-400 whitespace-nowrap">
                          {new Date(s._creationTime).toLocaleString("en-US")}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {renderStatusBadge(s.status)}
                        </td>
                        <td className="px-3 py-2 text-sm text-right">
                          <div className="inline-flex items-center gap-2">
                            {s.uid && (
                              <a
                                href={`/intake/${s.intakeFormId}/${s.uid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                              >
                                View
                              </a>
                            )}
                            <button
                              onClick={() => startEdit(s)}
                              className="inline-flex items-center justify-center rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                              aria-label="Edit Submission"
                            >
                              <IconEdit className="h-4 w-4" />
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

          {editing && (
            <EditSubmissionModal
              row={editing}
              values={editValues}
              statusValue={editStatus}
              onChangeValue={(name, val) => setEditValues((p) => ({ ...p, [name]: val }))}
              onChangeStatus={(val) => setEditStatus(val)}
              onClose={closeEdit}
              onSave={saveEdit}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function renderStatusBadge(status?: string) {
  if (!status) return <span className="text-slate-400">—</span>;
  const lower = status.toLowerCase();
  if (lower === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Pending
      </span>
    );
  }
  if (lower === "complete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg> Complete
      </span>
    );
  }
  if (lower === "incomplete") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 text-yellow-400 px-2 py-0.5">
        <span className="text-yellow-400">!</span> More Info Requested
      </span>
    );
  }
  return <span className="text-slate-400">{status}</span>;
}

function submissionTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={`skeleton-${i}`} className="hover:bg-slate-900/30">
          <td className="px-3 py-2">
            <div className="h-4 w-48 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-72 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-40 rounded bg-emerald-400/40 animate-pulse" />
          </td>
          <td className="px-3 py-2">
            <div className="h-4 w-24 rounded bg-emerald-400/40 animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}

function EditSubmissionModal({
  row,
  values,
  statusValue,
  onChangeValue,
  onChangeStatus,
  onClose,
  onSave,
}: {
  row: SubmissionListItem;
  values: Record<string, string>;
  statusValue?: string;
  onChangeValue: (name: string, val: string) => void;
  onChangeStatus: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const deleteSubmission = useMutation(api.functions.submissions.deleteSubmissionById);
  const [deleting, setDeleting] = React.useState(false);
  const fields: FieldSpec[] = row.formLayoutSnapshot?.fields ?? [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Edit Submission</h2>
          <p className="mt-1 text-xs text-slate-400">{row.formTitle}</p>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {fields.map((f: FieldSpec) => (
            <div key={f.name}>
              <label className="mb-1 block text-xs font-medium text-[#249F73]" htmlFor={`edit-${f.name}`}>
                {f.label}
              </label>
              <input
                id={`edit-${f.name}`}
                type={f.type === "phone" ? "tel" : f.type || "text"}
                value={values?.[f.name] ?? ""}
                onChange={(e) => onChangeValue(f.name, e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-medium text-[#249F73]">Status</label>
            <select
              value={statusValue ?? ""}
              onChange={(e) => onChangeStatus(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
            >
              <option value="">(no change)</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="incomplete">More Info Requested</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={async () => {
              if (deleting) return;
              setDeleting(true);
              try {
                await deleteSubmission({ id: row._id });
                onClose();
              } finally {
                setDeleting(false);
              }
            }}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-[#0b1217]"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function IconEdit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z" />
    </svg>
  );
}
