"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import Breadcrumbs from "../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";

export default function OrganizationPage() {
  // Resolve current org id via profile
  const profileOrg = useQuery(api.functions.profiles.getProfileOrganization, {});
  const organizationId = profileOrg && profileOrg.organizationId
    ? (profileOrg.organizationId as Id<"organizations">)
    : null;

  // Fetch org and settings
  const org = useQuery(
    api.functions.organizations.getOrganizationById,
    organizationId ? { organizationId } : "skip",
  ) as Doc<"organizations"> | null | undefined;

  const orgSettings = useQuery(
    api.functions.organizations.getOrganizationSettingsById,
    organizationId ? { organizationId } : "skip",
  ) as Doc<"organizationSettings"> | null | undefined;

  const isLoading = org === undefined || orgSettings === undefined;

  // Local editable state
  const [name, setName] = useState("");
  const [nextTicketId, setNextTicketId] = useState<number | "">("");
  const [defaultIntakeTitle, setDefaultIntakeTitle] = useState("");
  const [defaultIntakeDescription, setDefaultIntakeDescription] = useState("");

  // Track changes
  const [dirtyOrg, setDirtyOrg] = useState(false);
  const [dirtySettings, setDirtySettings] = useState(false);

  useEffect(() => {
    if (org) {
      setName(org.name ?? "");
      setNextTicketId(org.nextTicketId ?? "");
    }
  }, [org]);

  useEffect(() => {
    if (orgSettings) {
      setDefaultIntakeTitle(orgSettings.defaultIntakeTitle ?? "");
      setDefaultIntakeDescription(orgSettings.defaultIntakeDescription ?? "");
    }
  }, [orgSettings]);

  // Mutations
  const updateOrg = useMutation(api.functions.organizations.updateOrganizationById);
  const updateOrgSettings = useMutation(api.functions.organizations.updateOrganizationSettingsById);

  const canSave = !!organizationId && (dirtyOrg || dirtySettings);

  const handleSave = async () => {
    if (!organizationId) return;
    try {
      if (dirtyOrg) {
        await updateOrg({
          organizationId,
          ...(name !== org?.name ? { name } : {}),
          ...(typeof nextTicketId === "number" && nextTicketId !== org?.nextTicketId
            ? { nextTicketId }
            : {}),
        });
        setDirtyOrg(false);
      }

      if (dirtySettings) {
        await updateOrgSettings({
          organizationId,
          ...(defaultIntakeTitle !== orgSettings?.defaultIntakeTitle
            ? { defaultIntakeTitle }
            : {}),
          ...(defaultIntakeDescription !== orgSettings?.defaultIntakeDescription
            ? { defaultIntakeDescription }
            : {}),
        });
        setDirtySettings(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      {/* Title & actions */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <Breadcrumbs />
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>

      {/* Grid layout mirrors settings page */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left – Organization Overview / Defaults */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-sm font-medium text-slate-300">Organization</h2>
            <div className="mt-4 space-y-5">
              <FieldRow label="Name">
                {isLoading ? (
                  <div className="h-9 w-full rounded bg-emerald-400/40 animate-pulse" />
                ) : (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setDirtyOrg(true);
                    }}
                    className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                    placeholder="Organization name"
                  />
                )}
              </FieldRow>

              <FieldRow label="Next ticket #" description="Next friendly ticket id.">
                {isLoading ? (
                  <div className="h-9 w-40 rounded bg-emerald-400/40 animate-pulse" />
                ) : (
                  <input
                    type="number"
                    value={nextTicketId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNextTicketId(val === "" ? "" : Number(val));
                      setDirtyOrg(true);
                    }}
                    className="w-40 rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                    placeholder="e.g. 101"
                  />
                )}
              </FieldRow>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Defaults</h2>
            <div className="mt-4 space-y-5">
              <FieldRow label="Default intake title">
                {isLoading ? (
                  <div className="h-9 w-full rounded bg-emerald-400/40 animate-pulse" />
                ) : (
                  <div>
                    <input
                      type="text"
                      value={defaultIntakeTitle}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 50);
                        setDefaultIntakeTitle(value);
                        setDirtySettings(true);
                      }}
                      className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                      placeholder="Default intake title"
                    />
                    <p className="mt-1 text-xs text-slate-400">{defaultIntakeTitle.length}/50</p>
                  </div>
                )}
              </FieldRow>
              <FieldRow label="Default intake description">
                {isLoading ? (
                  <div className="h-24 w-full rounded bg-emerald-400/40 animate-pulse" />
                ) : (
                  <div>
                    <textarea
                      value={defaultIntakeDescription}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 200);
                        setDefaultIntakeDescription(value);
                        setDirtySettings(true);
                      }}
                      rows={4}
                      className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                      placeholder="Default intake description"
                    />
                    <p className="mt-1 text-xs text-slate-400">{defaultIntakeDescription.length}/200</p>
                  </div>
                )}
              </FieldRow>
            </div>
          </Card>
        </div>

        {/* Right – Appearance / Notifications */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-sm font-medium text-slate-300">Appearance</h2>
            <div className="mt-4 space-y-5">
              <FieldRow label="Theme">
                <SkeletonOrText loading={isLoading}>
                  {orgSettings?.theme ?? "—"}
                </SkeletonOrText>
              </FieldRow>
              <FieldRow label="Timezone">
                <SkeletonOrText loading={isLoading}>
                  {orgSettings?.timezone ?? "—"}
                </SkeletonOrText>
              </FieldRow>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-medium text-slate-300">Notifications</h2>
            <div className="mt-4 space-y-5">
              <FieldRow label="Email notifications">
                <SkeletonOrText loading={isLoading}>
                  {orgSettings?.emailNotifications ? "Enabled" : "Disabled"}
                </SkeletonOrText>
              </FieldRow>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, description, children }: {
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
      <div className="sm:col-span-2">
        <div className="rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

function SkeletonOrText({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) {
    return (
      <div className="h-4 w-48 rounded bg-emerald-400/40 animate-pulse" />
    );
  }
  return <>{children}</>;
}


