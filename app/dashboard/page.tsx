"use client";

// Chart.js and chart component imports
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import Breadcrumbs from "./helpers/Breadcrumbs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { Card } from "@/app/components/Card";
import { StatCard } from "@/app/components/StatCard";
import { Td, Th } from "@/app/components/Table";
import { StatusBadge } from "@/app/components/StatusBadge";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  LineElement,
  PointElement,
);

// Image processing helpers: crop to center square, then scale by provided factor
async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

async function cropAndResizeCenterSquare(
  file: File,
  scaleFactor: number = 0.75,
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const sourceWidth = img.naturalWidth || (img as any).width || 0;
  const sourceHeight = img.naturalHeight || (img as any).height || 0;
  if (!sourceWidth || !sourceHeight) {
    throw new Error("Unable to read image dimensions");
  }

  const side = Math.min(sourceWidth, sourceHeight);
  const sx = Math.floor((sourceWidth - side) / 2);
  const sy = Math.floor((sourceHeight - side) / 2);
  const targetSide = Math.max(1, Math.round(side * scaleFactor));

  const canvas = document.createElement("canvas");
  canvas.width = targetSide;
  canvas.height = targetSide;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, side, side, 0, 0, targetSide, targetSide);

  const outputType = file.type && /^image\/(png|jpeg|jpg|webp)$/i.test(file.type)
    ? file.type
    : "image/png";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType),
  );
  if (!blob) throw new Error("Failed to create image blob");
  return blob;
}

export default function DashboardClient() {
  const result = useQuery(api.functions.users.getCurrentWithSource);
  const profile = useQuery(
    api.functions.profiles.getProfileByUserId,
    result?.user?._id ? { userId: result.user._id } : "skip",
  );
  const createOrganization = useMutation(
    api.functions.organizations.createOrganization,
  );
  const createProfile = useMutation(api.functions.profiles.createProfile);
  const createUserSettings = useMutation(
    api.functions.usersettings.createUserSettings,
  );

  const generateProfilePictureUploadUrl = useMutation(
    api.functions.profiles.generateProfilePictureUploadUrl,
  );
  const saveProfilePicture = useMutation(
    api.functions.profiles.saveProfilePicture,
  );

  const dismissWhatsNew = useMutation(
    api.functions.usersettings.dismissWhatsNew,
  );

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const userSettingsQuery = useQuery(
    api.functions.usersettings.getUserSettingsByUserId,
    result?.user?._id ? { userId: result.user._id } : "skip",
  );

  useEffect(() => {
    if (profile === null && !showWhatsNewModal) {
      setShowProfileModal(true);
    }
  }, [profile, showWhatsNewModal]);

  useEffect(() => {
    if (
      !showProfileModal &&
      !isSaving &&
      profile !== null &&
      userSettingsQuery !== undefined &&
      (
        userSettingsQuery === null ||
        userSettingsQuery.whatsNewDismissed !== true
      )
    ) {
      setShowWhatsNewModal(true);
    }
  }, [userSettingsQuery, profile, showProfileModal, isSaving]);

  useEffect(() => {
    if (showProfileModal || showWhatsNewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showProfileModal, showWhatsNewModal]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200 flex">
      {showProfileModal && (
        <ProfileModal
          email={result!.user!.email!}
          onImageSelected={(file) => setSelectedImage(file)}
          saving={isSaving}
          onClose={() => setShowProfileModal(false)}
          onSave={async (data) => {
            setIsSaving(true);
            // 1. Create organization and get organizationId
            const organizationId = await createOrganization({
              name: data.orgName,
            });
            // 2. Create profile with userId, organizationId, firstName, lastName
            const newProfile = await createProfile({
              userId: result!.user!._id,
              organizationId,
              firstName: data.firstName,
              lastName: data.lastName,
            });

            // 2.5. Create user settings for this user
            await createUserSettings({ userId: result!.user!._id });

            // 2.6 Upload Profile Picture to Convex Files (crop center square and resize to 50%)
            if (selectedImage) {
              const processed = await cropAndResizeCenterSquare(selectedImage, 0.50);
              const contentType = processed.type || selectedImage.type || "image/png";

              const uploadUrl = await generateProfilePictureUploadUrl();
              const uploadResult = await fetch(uploadUrl, {
                method: "POST",
                headers: { "content-type": contentType },
                body: processed,
              });

              const { storageId } = await uploadResult.json();

              await saveProfilePicture({
                storageId,
                profileId: newProfile,
              });
            }

            // 3. Close the modal after all async work completes
            setShowProfileModal(false);
            // 4. After closing, show What's New if userSettingsQuery is defined and not dismissed
            if (
              userSettingsQuery !== undefined &&
              (
                userSettingsQuery === null ||
                userSettingsQuery.whatsNewDismissed !== true
              )
            ) {
              setShowWhatsNewModal(true);
            }
            setIsSaving(false);
          }}
        />
      )}
      {showWhatsNewModal && (
        <WhatsNewModal
          onDismiss={async () => {
            if (userSettingsQuery?._id) {
              await dismissWhatsNew({ id: userSettingsQuery._id });
            }
            setShowWhatsNewModal(false);
          }}
        />
      )}
      {/* <Sidebar pathname={pathname} initialEmail={initialEmail} /> */}
      <main className="flex-1">
        {/* Page content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8">
          {/* Breadcrumb / Page title */}
          <div className="mb-6">
            {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}
            <div className="mb-6 flex items-center justify-between">
              <Breadcrumbs />
              {/* Placeholder to match Tickets header height (36px) */}
              <div className="h-9" />
            </div>
            {/* <p className="mt-1 text-sm text-slate-400">Quick glance at your product health and recent activity.</p> */}
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Open tickets" value="128" delta="+6.7%" />
            <StatCard
              label="Avg response"
              value="72h 48m"
              delta="+512%"
              positive={false}
            />
            <StatCard
              label="SLA breaches"
              value="3"
              delta="-25%"
              positive={true}
            />
            <StatCard label="Active users" value="2,413" delta="+3.1%" />
          </section>

          {/* Unified main content grid */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <div className="flex flex-col gap-6">
                {/* Tickets Bar Chart */}
                <Card>
                  <h2 className="text-sm font-medium text-slate-300 mb-4">
                    Tickets Opened vs Closed (Last 30 Days)
                  </h2>
                  <div className="h-64">
                    <TicketsBarChart />
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-300">
                      Recent Activity
                    </h2>
                    <button className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                      View all
                    </button>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-md border border-slate-800">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/60 text-slate-400">
                        <tr>
                          <Th>Ticket</Th>
                          <Th>Customer</Th>
                          <Th>Status</Th>
                          <Th>Updated</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {[
                          {
                            id: "#4832",
                            cust: "Acme Inc.",
                            status: "Open",
                            time: "3m ago",
                          },
                          {
                            id: "#4831",
                            cust: "Globex",
                            status: "Pending",
                            time: "15m ago",
                          },
                          {
                            id: "#4829",
                            cust: "Soylent",
                            status: "Resolved",
                            time: "1h ago",
                          },
                          {
                            id: "#4828",
                            cust: "Initech",
                            status: "Open",
                            time: "2h ago",
                          },
                        ].map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/30">
                            <Td className="font-medium text-slate-200">
                              {r.id}
                            </Td>
                            <Td>{r.cust}</Td>
                            <Td>
                              <StatusBadge status={r.status} />
                            </Td>
                            <Td className="text-slate-400">{r.time}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Workload */}
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-300">
                      Workload (placeholder)
                    </h2>
                    <button className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]">
                      Configure
                    </button>
                  </div>
                  <div className="mt-4 h-56 rounded-md border border-dashed border-slate-700/70 bg-slate-900/30 grid place-content-center text-slate-500 text-sm">
                    Add a chart here (e.g., area chart of tickets over time)
                  </div>
                </Card>
              </div>
            </section>
            <aside className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <h2 className="text-sm font-medium text-slate-300">
                  Quick actions
                </h2>
                <div className="mt-4 grid gap-3">
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white
                               bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2
                               focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]">
                    New Ticket
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700">
                    Invite teammate
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700">
                    Export report
                  </button>
                </div>
              </Card>
              {/* System Status */}
              <Card>
                <h2 className="text-sm font-medium text-slate-300">
                  System status
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">API</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">Database</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Operational
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-400">Auth</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                      Degraded
                    </span>
                  </li>
                </ul>
              </Card>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

function ProfileModal({
  email,
  // onClose,
  onImageSelected,
  saving,
  onSave,
}: {
  email: string;
  onClose: () => void;
  onImageSelected: (file: File | null) => void;
  saving: boolean;
  onSave: (
    data: {
      firstName: string;
      lastName: string;
      orgName: string;
      email: string;
      phone: string;
    },
  ) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [animate, setAnimate] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Trigger scale-in after mount
    setTimeout(() => setAnimate(true), 10);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstName, lastName, orgName, email, phone });
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl transform transition-transform duration-300 ease-out ${
          animate ? "scale-100" : "scale-0"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Complete your profile
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Just a few details to get you started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
                placeholder="Jane"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Organization Name
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
              placeholder="Acme Inc."
            />
          </div>

          {/* Email (disabled) */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-400 placeholder-slate-500 opacity-70 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Phone Number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217]"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Profile picture uploader */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Profile Picture
            </label>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-20 w-20 rounded-md border border-dashed border-slate-700/70 bg-slate-900/30 grid place-content-center overflow-hidden">
                {previewUrl
                  ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  )
                  : (
                    <span className="text-slate-500 text-[10px]">No image</span>
                  )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                      onImageSelected(file);
                    } else {
                      setPreviewUrl(null);
                      onImageSelected(null);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                >
                  Upload
                </button>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      onImageSelected(null);
                    }}
                    className="text-xs rounded-md px-2.5 py-1 border border-slate-700 bg-slate-800/60 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// What's New Modal
function WhatsNewModal({ onDismiss }: { onDismiss: () => void }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimate(true), 10);
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Panel */}
      <div
        className={`relative w-full max-w-lg rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 shadow-xl backdrop-blur-md transform transition-transform duration-300 ease-out ${
          animate ? "scale-100" : "scale-0"
        }`}
      >
        {/* Tag */}
        <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
          New in v0.4.3
        </span>

        {/* Heading */}
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-sky-400">
          What&apos;s New
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Discover the latest updates and improvements in Triage.
        </p>

        {/* Features */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg">
            <span className="text-lg">📝</span>
            <p className="text-sm text-slate-200">
              <b>Profile creation improved:</b>{" "}
              New users are prompted to complete their profile for a smoother
              onboarding experience.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg">
            <span className="text-lg">📐</span>
            <p className="text-sm text-slate-200">
              <b>Sidebar restructured:</b>{" "}
              Navigation is now simpler with clearer sections.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg">
            <span className="text-lg">👤</span>
            <p className="text-sm text-slate-200">
              <b>Names in sidebar:</b>{" "}
              Your full name is now displayed for better identification.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg">
            <span className="text-lg">🆕</span>
            <p className="text-sm text-slate-200">
              <b>What&apos;s New popup:</b>{" "}
              Stay informed about the latest features and changes.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg">
            <span className="text-lg">🗑️</span>
            <p className="text-sm text-slate-200">
              <b>Delete User Data:</b>{" "}
              You can now delete your account and all associated data from the
              settings page.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-[#0b1217]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// TicketsBarChart component (mock data, dark theme, now as a line chart)
function TicketsBarChart() {
  // Mock data for 30 days
  const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  // Generate mock opened and closed data for 30 days
  const opened = Array.from(
    { length: 30 },
    (_, i) => 10 + Math.round(Math.sin(i / 3) * 4 + Math.random() * 3),
  );
  const closed = Array.from(
    { length: 30 },
    (_, i) => 8 + Math.round(Math.cos(i / 2.2) * 3 + Math.random() * 2),
  );

  const data = {
    labels: days,
    datasets: [
      {
        label: "Tickets Opened",
        data: opened,
        borderColor: "rgba(52, 211, 153, 0.8)", // emerald-400
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(52, 211, 153, 1)",
      },
      {
        label: "Tickets Closed",
        data: closed,
        borderColor: "rgba(59, 130, 246, 0.8)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1", // slate-300
          font: { size: 14, family: "inherit" },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b", // slate-800
        titleColor: "#f1f5f9", // slate-100
        bodyColor: "#cbd5e1", // slate-300
        borderColor: "#334155", // slate-700
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day of Month",
          color: "#94a3b8", // slate-400
          font: { size: 13, weight: "bold", family: "inherit" },
        },
        grid: {
          color: "rgba(30,41,59,0.2)", // subtle grid
        },
        ticks: {
          color: "#cbd5e1", // slate-300
          font: { size: 13, family: "inherit" },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Tickets",
          color: "#94a3b8", // slate-400
          font: { size: 13, weight: "bold", family: "inherit" },
        },
        grid: {
          color: "rgba(30,41,59,0.2)",
        },
        ticks: {
          color: "#cbd5e1",
          font: { size: 13, family: "inherit" },
        },
      },
    },
    layout: {
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
    },
    backgroundColor: "#0b1217",
  };

  return (
    <div style={{ width: "100%", minHeight: 275 }}>
      <Line data={data} options={options as ChartOptions<"line">} />
    </div>
  );
}
