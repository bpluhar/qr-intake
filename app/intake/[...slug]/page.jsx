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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (document && document.formLayout?.fields) {
      const init = {};
      for (const field of document.formLayout.fields) {
        init[field.name] = "";
      }
      setFormValues(init);
    }
  }, [document]);

  const submit = useMutation(api.functions.submissions.submitIntakeForm);

  // start timing once form id is available
  useEffect(() => {
    if (formId) setStartTs(Date.now());
  }, [formId]);

  // Check if this UID has already submitted
  const existingSubmission = useQuery(
    api.functions.submissions.getSubmissionByFormAndUid,
    formId && uid ? { intakeFormId: formId, uid } : "skip",
  );

  if (!formId) {
    return <div style={{ color: "white", padding: "1rem" }}>Loading…</div>;
  }
  if (!uid) {
    return <div style={{ color: "white", padding: "1rem" }}>Preparing…</div>;
  }
  if (document === undefined) {
    return <div style={{ color: "white", padding: "1rem" }}>Loading…</div>  ;
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

  const validateField = (f, value) => {
    const str = String(value ?? "").trim();
    if (f.required && !str) return "This field is required";
    if (f.name === "firstName" || f.name === "lastName") {
      if (!str) return undefined;
      const lettersOnly = str.replace(/[^A-Za-z]/g, "");
      if (lettersOnly.length < 2) return "Must be letters only, minimum 2";
      if (!/^[A-Za-z]+(?:['-][A-Za-z]+)*$/.test(str)) {
        return "Only letters; single ' or - allowed between parts";
      }
    }
    if (f.type === "email" || f.name === "email") {
      if (!str) return undefined;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return "Invalid email";
    }
    if (f.type === "phone" || f.name === "phone") {
      const digits = str.replace(/\D/g, "");
      if (digits && digits.length !== 10) return "Must be 10 digits";
    }
    return undefined;
  };

  const formatPhone = (digits) => {
    if (!digits) return "";
    const d = digits.slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  };

  const handleChange = (field, rawValue) => {
    let value = rawValue;
    if (field.type === "phone" || field.name === "phone") {
      const digits = String(rawValue ?? "").replace(/\D/g, "");
      value = formatPhone(digits);
    }
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field.name]: err }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // final validation across all required fields
    const allErrors = {};
    let ok = true;
    for (const f of fields) {
      const err = validateField(f, formValues[f.name]);
      if (err) ok = false;
      allErrors[f.name] = err;
    }
    setErrors(allErrors);
    if (!ok) return;

    const elapsed = startTs ? Date.now() - startTs : undefined;
    try {
      setIsSubmitting(true);
      setSubmitError("");
      await submit({
        intakeFormId: formId,
        organizationId: document.organizationId,
        data: formValues,
        timeTaken: elapsed,
        uid,
      });
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                handleChange(f, e.target.value);
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
      const err = validateField(f, formValues[f.name]);
      nextErrors[f.name] = err;
      if (err) ok = false;
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
    const currentGroup = step >= 1 && step <= 3 ? (stepFieldGroups[step - 1] || []) : [];
    const canProceed =
      step >= 1 && step <= 3
        ? currentGroup.every((f) => !validateField(f, formValues[f.name]))
        : true;
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
              disabled={!canProceed}
              className={`w-full inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] ${
                canProceed ? "bg-[#249F73] hover:bg-[#1E8761]" : "bg-slate-700 cursor-not-allowed opacity-60"
              }`}
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
              disabled={!canProceed}
              className={`w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] ${
                canProceed ? "bg-[#249F73] hover:bg-[#1E8761]" : "bg-slate-700 cursor-not-allowed opacity-60"
              }`}
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
              disabled={!canProceed}
              className={`w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3ECF8E] focus:ring-offset-[#0b1217] ${
                canProceed ? "bg-[#249F73] hover:bg-[#1E8761]" : "bg-slate-700 cursor-not-allowed opacity-60"
              }`}
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
              {isSubmitting ? "Submitting…" : "Submit"}
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
            {document.formLayout?.title} {existingSubmission?.status && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            {existingSubmission.status === "pending" && (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#249F73] border-t-transparent" />
                <span className="text-sm text-[#249F73] font-medium">Pending…</span>
              </>
            )}
            {existingSubmission.status === "complete" && (
              <>
                <svg className="h-4 w-4 text-[#249F73]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>
                <span className="text-sm text-[#249F73] font-medium">Complete</span>
              </>
            )}
            {existingSubmission.status === "incomplete" && (
              <>
                <span className="text-yellow-400">!</span>
                <span className="text-sm text-yellow-400 font-medium">More Info Requested</span>
              </>
            )}
          </div>
        )}
          </h1>
          <div className="mt-8 rounded-md border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-slate-200">Your submission has been received.</p>
            <p className="my-2 text-sm text-slate-400">This page receives realtime updates, hang tight!</p>
          {/* </div>
          <div className="mt-8 rounded-md border border-slate-800 bg-slate-900/60 p-6 space-y-2"> */}
            <div>
              <span className="text-sm font-semibold text-[#249F73] mr-2">Name</span>
              <span className="text-slate-200 text-sm">
                {(existingSubmission?.data?.firstName || "").trim()} {(existingSubmission?.data?.lastName || "").trim()}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#249F73] mr-2">Email</span>
              <span className="text-slate-200 text-sm">{existingSubmission?.data?.email || "—"}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#249F73] mr-2">Phone</span>
              <span className="text-slate-200 text-sm">{existingSubmission?.data?.phone || "—"}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#249F73] mr-2">Submitted</span>
              <span className="text-slate-200 text-sm">{new Date(existingSubmission?._creationTime).toLocaleString("en-US")}</span>
            </div>
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
          {submitError && (
            <div className="mb-3 rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {submitError}
            </div>
          )}
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


