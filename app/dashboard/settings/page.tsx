// app/dashboard/settings/page.tsx
// Server Component – Settings UI only (no functionality). Matches dark theme used across /dashboard.

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/app/components/Card";

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteUserDataMutation = useMutation(api.functions.helpers.deleteUserData);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-center justify-between gap-3">
        
          <Breadcrumbs />
          {/* <h1 className="text-xl font-semibold">Settings</h1> */}
          {/* <p className="mt-1 text-sm text-slate-400">These controls are UI-only for now. Hook them up to Convex whenever you’re ready.</p> */}
        
        <div className="flex items-center gap-2">
          <button
            disabled
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] disabled:opacity-60 cursor-not-allowed border border-transparent"
            title="Mock UI"
          >
            Save
          </button>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Learn more...
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left – General / Notifications */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-sm font-medium text-slate-300">General</h2>
            <div className="mt-4 space-y-5">
              <FieldRow
                label="Workspace name"
                description="Shown in emails and invoices."
              >
                <input
                  type="text"
                  defaultValue="Triage"
                  disabled
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] disabled:cursor-not-allowed"
                />
              </FieldRow>

              <FieldRow
                label="Default timezone"
                description="Used for reports and SLAs."
              >
                <select
                  disabled
                  defaultValue="America/New_York"
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] disabled:cursor-not-allowed"
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </FieldRow>

              <FieldRow
                label="Appearance"
                description="Theme for the dashboard UI."
              >
                <select
                  disabled
                  defaultValue="triage-dark"
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] disabled:cursor-not-allowed"
                >
                  <option value="triage-dark">Triage – Dark</option>
                  <option value="system">System</option>
                  <option value="light">Light</option>
                </select>
              </FieldRow>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Notifications</h2>
            <div className="mt-4 space-y-5">
              <ToggleRow
                label="Email me when I’m assigned a ticket"
                description="Assignee changes and new assignments."
                on
              />
              <ToggleRow
                label="Daily ticket summary"
                description="A digest of open, pending and breached tickets."
              />
              <ToggleRow
                label="Customer ratings (CSAT)"
                description="Get notified when a rating is submitted."
                on
              />
              <ToggleRow
                label="Product updates"
                description="Occasional emails about new features."
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Accessibility</h2>
            <div className="mt-4 space-y-5">
              <FieldRow
                label="Text size"
                description="Controls body font size in the app."
              >
                <Range disabled defaultValue={16} min={12} max={20} step={1} />
              </FieldRow>
              <FieldRow
                label="Motion"
                description="Reduce motion on transitions and charts."
              >
                <select
                  disabled
                  defaultValue="reduced"
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] disabled:cursor-not-allowed"
                >
                  <option value="normal">Normal</option>
                  <option value="reduced">Reduced</option>
                </select>
              </FieldRow>
            </div>
          </Card>
        </div>

        {/* Right – Security / Integrations / Danger */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-sm font-medium text-slate-300">Security</h2>
            <div className="mt-4 space-y-5">
              <ToggleRow
                label="Two‑factor authentication (2FA)"
                description="Add an extra layer of security to your account."
                on
              />
              <FieldRow label="Session timeout" description="Log out after a period of inactivity.">
                <Range disabled defaultValue={60} min={15} max={240} step={15} suffix=" min" />
              </FieldRow>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Integrations</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { name: "Slack", connected: true },
                { name: "GitHub", connected: false },
                { name: "Linear", connected: false },
              ].map((i) => (
                <li key={i.name} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                    <span>{i.name}</span>
                  </div>
                  <button
                    disabled
                    className={`rounded-md px-2.5 py-1 text-xs border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] ${
                      i.connected
                        ? "bg-slate-800/70 border-slate-700 text-slate-300"
                        : "bg-[#249F73] hover:bg-[#1E8761] text-white border-transparent"
                    }`}
                  >
                    {i.connected ? "Connected" : "Connect"}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Danger zone</h2>
            <div className="mt-4 rounded-md border border-red-900/40 bg-red-900/10 p-4">
              <p className="text-sm text-slate-300">Delete all associated data linked to your account.</p>
              <div className="mt-3">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600/80 border border-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                >
                  Delete User Data
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showDeleteModal && (
        <Modal onClose={() => {
                const modalElement = document.querySelector('.modal-panel');
                if (modalElement) {
                  modalElement.classList.remove('scale-100');
                  modalElement.classList.add('scale-0');
                  setTimeout(() => setShowDeleteModal(false), 25);
                } else {
                  setShowDeleteModal(false);
                }
              }}>
          <h3 className="text-lg font-semibold text-slate-200">Confirm Deletion</h3>
          <p className="mt-2 text-sm text-slate-300">
            Delete all associated data linked to your account, including but not limited to your profile, organization, tickets, and user settings. This action cannot be undone.
          </p>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                const modalElement = document.querySelector('.modal-panel');
                if (modalElement) {
                  modalElement.classList.remove('scale-100');
                  modalElement.classList.add('scale-0');
                  setTimeout(() => setShowDeleteModal(false), 25);
                } else {
                  setShowDeleteModal(false);
                }
              }}
              className="rounded-md px-3 py-2 text-sm font-medium bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                const result = await deleteUserDataMutation();
                console.log("Delete user data result:", result);
                setShowDeleteModal(false);
                window.location.href = "/dashboard";
              }}
              className="rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------ UI Helpers ------------------------------ */

// Removed local Card in favor of shared component

function FieldRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
      <div className="sm:col-span-1">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description ? (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        ) : null}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, on = false }: { label: string; description?: string; on?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}
      </div>
      <Toggle on={on} />
    </div>
  );
}

function Toggle({ on = false }: { on?: boolean }) {
  // Presentational switch only
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled
      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors disabled:cursor-not-allowed ${
        on ? "bg-emerald-600/70 border-emerald-500/40" : "bg-slate-700/60 border-slate-600/60"
      }`}
      title="Mock switch"
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function Range({ disabled, defaultValue, min, max, step, suffix }: {
  disabled?: boolean;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        disabled={disabled}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        className="w-full accent-emerald-500 [--tw-range-thumb:theme(colors.emerald.500)]"
      />
      {typeof defaultValue === "number" ? (
        <span className="w-12 text-right text-sm text-slate-300 tabular-nums">
          {defaultValue}
          {suffix ?? ""}
        </span>
      ) : null}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [animate, setAnimate] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className={`modal-panel rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl transform transition-transform w-full max-w-lg ${
          closing ? "scale-0" : animate ? "scale-100" : "scale-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ transitionDuration: "150ms", transitionTimingFunction: "ease" }}
      >
        {children}
      </div>
    </div>
  );
}