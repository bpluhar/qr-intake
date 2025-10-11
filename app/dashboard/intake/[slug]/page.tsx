"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../helpers/Breadcrumbs";
import { Card } from "@/app/components/Card";

export default function IntakeEditPage() {
  const params = useParams();
  const slug = params.slug as string | undefined;

  const doc = useQuery(
    api.functions.intakeForms.getIntakeFormById,
    slug ? { id: slug as any } : "skip",
  );

  const updateIntakeForm = useMutation(api.functions.intakeForms.updateIntakeForm);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (doc) {
      setTitle(doc.formLayout?.title ?? "");
      setDescription(doc.formLayout?.description ?? "");
      setDirty(false);
    }
  }, [doc]);

  const canSave = !!slug && dirty;

  const handleSave = async () => {
    if (!slug) return;
    await updateIntakeForm({ id: slug as any, ...(title !== doc?.formLayout?.title ? { title } : {}), ...(description !== doc?.formLayout?.description ? { description } : {}) });
    setDirty(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0 lg:py-8 text-slate-200">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Breadcrumbs />
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] disabled:opacity-60"
        >
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-sm font-medium text-slate-300">Intake Form</h2>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setDirty(true); }}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                  placeholder="Title"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
                  rows={4}
                  className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E]"
                  placeholder="Description"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


