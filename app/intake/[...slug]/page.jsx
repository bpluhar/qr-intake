"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo, useState } from "react";

function generateUid(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function IntakeFormPage() {
  const params = useParams();
  const router = useRouter();
  const slugParam = params.slug;

  const { formId, initialUid } = useMemo(() => {
    if (Array.isArray(slugParam)) {
      return { formId: slugParam[0], initialUid: slugParam[1] };
    }
    return { formId: slugParam, initialUid: undefined };
  }, [slugParam]);

  const [uid, setUid] = useState(initialUid ?? undefined);

  // Ensure UID exists in URL without reload
  useEffect(() => {
    if (!formId) return;
    if (!uid) {
      const newUid = generateUid(8);
      setUid(newUid);
      const newPathWithUid = `/intake/${formId}/${newUid}`;
      window.history.replaceState(null, '', newPathWithUid);
    }
  }, [formId, uid]);

  const document = useQuery(api.functions.intakeForms.getIntakeFormById, formId ? {
    id: formId,
  } : "skip");

  const updateViewCount = useMutation(
    api.functions.intakeForms.updateViewCount,
  );

  useEffect(() => {
    if (formId) {
      updateViewCount({ id: formId });
    }
  }, [formId, updateViewCount]);

  const [formValues, setFormValues] = useState({});
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [startTs, setStartTs] = useState(0);

  useEffect(() => {
    if (document && document.formLayout?.fields) {
      const init = {};
      for (const field of document.formLayout.fields) {
        init[field.name] = "";
      }
      setFormValues(init);
    }
  }, [document]);

  const submit = useMutation(api.functions.intakeForms.submitIntakeForm);

  // start timing once form id is available
  useEffect(() => {
    if (formId) setStartTs(Date.now());
  }, [formId]);

  // Check if this UID has already submitted
  const existingSubmission = useQuery(
    api.functions.intakeForms.getSubmissionByFormAndUid,
    formId && uid ? { intakeFormId: formId, uid } : "skip",
  );

  if (!formId) {
    return <div style={{ color: "white", padding: "1rem" }}>Loading…</div>;
  }
  if (!uid) {
    return <div style={{ color: "white", padding: "1rem" }}>Preparing…</div>;
  }
  if (document === undefined) {
    return <div style={{ color: "white", padding: "1rem" }}>Loading form…</div>;
  }
  if (document === null) {
    return (
      <div style={{ color: "white", padding: "1rem" }}>Form not found</div>
    );
  }

  const fields = document.formLayout?.fields ?? [];
  const totalSteps = 4;
  const stepFieldGroups = [
    fields.slice(0, 2), // Step 1: first + last
    fields.slice(2, 3), // Step 2: email
    fields.slice(3, 4), // Step 3: phone
  ];

  const handleChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const elapsed = startTs ? Date.now() - startTs : undefined;
    await submit({
      intakeFormId: formId,
      organizationId: document.organizationId,
      data: formValues,
      timeTaken: elapsed,
      uid,
    });
  };

  const mapType = (t) => {
    if (t === "phone") return "tel";
    return t || "text";
  };

  // Render helpers
  const renderFields = (whichStep) => {
    if (whichStep >= 1 && whichStep <= 3) {
      const group = stepFieldGroups[whichStep - 1] || [];
      return group.map((f) => {
        const hasError = !!errors[f.name];
        return (
          <div key={f.name}>
            <label
              className="mb-1 block text-xs font-medium text-[#249F73]"
              htmlFor={f.name}
            >
              {f.label}
              {f.required ? " *" : ""}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={mapType(f.type)}
              value={formValues[f.name] ?? ""}
              onChange={(e) => {
                if (hasError && e.target.value) {
                  setErrors((prev) => ({ ...prev, [f.name]: undefined }));
                }
                handleChange(f.name, e.target.value);
              }}
              placeholder={f.placeholder ?? ""}
              className={`w-full rounded-md border bg-slate-800/60 px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3ECF8E] focus:ring-offset-2 focus:ring-offset-[#0b1217] ${
                hasError ? "border-red-500" : "border-slate-700"
              }`}
            />
            {hasError && (
              <p className="mt-1 text-xs text-red-400">{errors[f.name]}</p>
            )}
          </div>
        );
      });
    }

    // Step 4: Overview
    return (
      <div className="space-y-3">
        {fields.map((f) => (
          <div
            key={f.name}
            className="rounded-md border border-slate-700 bg-slate-900/40 p-3"
          >
            <div className="text-xs font-semibold text-[#249F73]">
              {f.label}
            </div>
            <div className="mt-1 text-sm text-slate-200 break-words">
              {formValues[f.name] || "—"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const validateCurrentStep = () => {
    if (step < 1 || step > 3) return true;
    const group = stepFieldGroups[step - 1] || [];
    const nextErrors = { ...errors };
    let ok = true;
    for (const f of group) {
      if (f.required && !String(formValues[f.name] ?? "").trim()) {
        nextErrors[f.name] = "This field is required";
        ok = false;
      } else {
        nextErrors[f.name] = undefined;
      }
    }
    setErrors(nextErrors);
    return ok;
  };

  const tryNext = () => {
    if (validateCurrentStep()) {
      setStep(Math.min(step + 1, totalSteps));
    }
  };

  const renderControls = () => {
    return (
      <div className="mt-auto pt-4 pb-2">
        {/* Dots */}
        <div className="mb-3 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i + 1 === step ? "bg-[#249F73]" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        {step === 1 && (
          <div className="flex">
            <button
              type="button"
              onClick={tryNext}
              className="w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-[rgba(30,41,59,0.7)] hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              onClick={tryNext}
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-[rgba(30,41,59,0.7)] hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              onClick={tryNext}
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 bg-[rgba(30,41,59,0.7)] hover:bg-[#1f2937] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-[#249F73] hover:bg-[#1E8761] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217]"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  };

  // If already submitted, show a thank you screen
  if (existingSubmission) {
    return (
      <div className="min-h-screen bg-[#0b1217] text-slate-200">
        <div className="mx-auto max-w-3xl p-6 pb-6 flex flex-col min-h-screen">
          <h1 className="text-xl font-semibold text-slate-100">
            {document.formLayout?.title}
          </h1>
          <div className="mt-8 rounded-md border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-slate-200">Thank you! Your submission has been received.</p>
            <p className="mt-2 text-sm text-slate-400">You can revisit this page to see updates related to your intake.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1217] text-slate-200">
      <div className="mx-auto max-w-3xl p-6 pb-6 flex flex-col min-h-screen">
        <h1 className="text-xl font-semibold text-slate-100">
          {document.formLayout?.title}
        </h1>
        {document.formLayout?.description && (
          <p className="mt-1 text-sm text-slate-400">
            {document.formLayout.description}
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 flex-1 flex flex-col">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
            >
              <div className="w-full flex-shrink-0 space-y-4">
                {renderFields(1)}
              </div>
              <div className="w-full flex-shrink-0 space-y-4">
                {renderFields(2)}
              </div>
              <div className="w-full flex-shrink-0 space-y-4">
                {renderFields(3)}
              </div>
              <div className="w-full flex-shrink-0 space-y-4">
                {renderFields(4)}
              </div>
            </div>
          </div>

          {renderControls()}
        </form>
      </div>
    </div>
  );
}


