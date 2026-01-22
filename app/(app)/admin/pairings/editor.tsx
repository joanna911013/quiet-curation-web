"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  approvePairing,
  savePairing,
  setTodayPairing,
  unapprovePairing,
  type PairingFormInput,
} from "../actions";

type PairingEditorProps = {
  initial: PairingFormInput & {
    id?: string | null;
    status?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  };
  today: string;
};

const EMPTY_ERRORS: string[] = [];

export function PairingEditor({ initial, today }: PairingEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<PairingFormInput>({
    id: initial.id ?? null,
    pairing_date: initial.pairing_date ?? today,
    locale: initial.locale ?? "en",
    status: initial.status ?? "draft",
    verse_id: initial.verse_id ?? "",
    literature_author: initial.literature_author ?? "",
    literature_title: initial.literature_title ?? "",
    literature_source: initial.literature_source ?? "",
    literature_text: initial.literature_text ?? "",
    rationale_short: initial.rationale_short ?? "",
  });
  const [saveErrors, setSaveErrors] = useState<string[]>(EMPTY_ERRORS);
  const [approveErrors, setApproveErrors] = useState<string[]>(EMPTY_ERRORS);
  const [infoMessage, setInfoMessage] = useState("");
  const [existingPairingId, setExistingPairingId] = useState<string | null>(
    null,
  );
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(
    initial.updated_at ?? initial.created_at ?? null,
  );
  const [isPending, startTransition] = useTransition();

  const statusLabel = form.status ?? "draft";

  const lastSavedLabel = useMemo(() => {
    if (!lastSavedAt) {
      return "Not saved yet.";
    }
    return `Last saved ${new Date(lastSavedAt).toLocaleString()}`;
  }, [lastSavedAt]);

  const updateField = (key: keyof PairingFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaveErrors(EMPTY_ERRORS);
    setInfoMessage("");
    setExistingPairingId(null);
    startTransition(async () => {
      const result = await savePairing(form);
      if (!result.ok) {
        setSaveErrors(result.errors ?? [result.error]);
        if (result.existingPairingId) {
          setExistingPairingId(result.existingPairingId);
        }
        return;
      }
      setLastSavedAt(result.lastSavedAt);
      setExistingPairingId(null);
      if (result.status) {
        setForm((prev) => ({ ...prev, status: result.status }));
      }
      if (!form.id && result.pairingId) {
        router.replace(`/admin/pairings/${result.pairingId}`);
      }
      setInfoMessage("Saved.");
      router.refresh();
    });
  };

  const handleApprove = () => {
    setApproveErrors(EMPTY_ERRORS);
    setInfoMessage("");
    if (!form.id) {
      setApproveErrors(["Save the draft before approving."]);
      return;
    }
    startTransition(async () => {
      const result = await approvePairing(form.id as string);
      if (!result.ok) {
        setApproveErrors(result.errors ?? [result.error]);
        return;
      }
      setLastSavedAt(result.lastSavedAt);
      setForm((prev) => ({ ...prev, status: "approved" }));
      setInfoMessage("Approved.");
      router.refresh();
    });
  };

  const handleUnapprove = () => {
    setApproveErrors(EMPTY_ERRORS);
    setInfoMessage("");
    if (!form.id) {
      return;
    }
    startTransition(async () => {
      const result = await unapprovePairing(form.id as string);
      if (!result.ok) {
        setApproveErrors(result.errors ?? [result.error]);
        return;
      }
      setLastSavedAt(result.lastSavedAt);
      setForm((prev) => ({ ...prev, status: "draft" }));
      setInfoMessage("Moved to draft.");
      router.refresh();
    });
  };

  const handleSetToday = () => {
    setInfoMessage("");
    if (!form.id) {
      setApproveErrors(["Save the draft before setting today."]);
      return;
    }
    startTransition(async () => {
      const result = await setTodayPairing(form.id as string, form.locale);
      if (!result.ok) {
        setApproveErrors(result.errors ?? [result.error]);
        return;
      }
      setForm((prev) => ({ ...prev, pairing_date: today }));
      setInfoMessage("Set for today.");
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Pairing Editor
          </p>
          <h1 className="text-2xl font-semibold">
            {form.id ? "Edit pairing" : "New pairing"}
          </h1>
          <p className="text-xs text-neutral-500">{lastSavedLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
          >
            Save draft
          </button>
          {statusLabel === "approved" ? (
            <button
              type="button"
              onClick={handleUnapprove}
              disabled={isPending}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
            >
              Unapprove
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApprove}
              disabled={isPending}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
            >
              Approve
            </button>
          )}
          <button
            type="button"
            onClick={handleSetToday}
            disabled={isPending}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700"
          >
            Set as Today
          </button>
        </div>
      </div>

      {infoMessage ? (
        <p className="text-sm text-emerald-600">{infoMessage}</p>
      ) : null}

      {saveErrors.length ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <p className="font-medium">Fix these to save:</p>
          <ul className="mt-2 list-disc pl-5">
            {saveErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
          {existingPairingId ? (
            <p className="mt-2 text-xs text-rose-600">
              Existing pairing found for this date/locale.{" "}
              <Link
                className="underline"
                href={`/admin/pairings/${existingPairingId}`}
              >
                Open it
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      {approveErrors.length ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <p className="font-medium">Approval checks:</p>
          <ul className="mt-2 list-disc pl-5">
            {approveErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Pairing date
          <input
            type="date"
            value={form.pairing_date}
            onChange={(event) => updateField("pairing_date", event.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Locale
          <input
            type="text"
            value={form.locale}
            onChange={(event) => updateField("locale", event.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Status
          <select
            value={form.status ?? "draft"}
            onChange={(event) => updateField("status", event.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          >
            <option value="draft">draft</option>
            <option value="approved">approved</option>
          </select>
          <span className="text-xs text-neutral-400">
            Approval runs validation; use the Approve button.
          </span>
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Verse ID
          <input
            type="text"
            value={form.verse_id}
            onChange={(event) => updateField("verse_id", event.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Literature author
          <input
            type="text"
            value={form.literature_author ?? ""}
            onChange={(event) =>
              updateField("literature_author", event.target.value)
            }
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Literature title
          <input
            type="text"
            value={form.literature_title ?? ""}
            onChange={(event) =>
              updateField("literature_title", event.target.value)
            }
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600">
          Literature source
          <input
            type="text"
            value={form.literature_source ?? ""}
            onChange={(event) =>
              updateField("literature_source", event.target.value)
            }
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600 md:col-span-2">
          Literature excerpt
          <textarea
            value={form.literature_text ?? ""}
            onChange={(event) =>
              updateField("literature_text", event.target.value)
            }
            rows={5}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-neutral-600 md:col-span-2">
          Rationale (short)
          <textarea
            value={form.rationale_short ?? ""}
            onChange={(event) =>
              updateField("rationale_short", event.target.value)
            }
            rows={3}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          />
        </label>
      </form>

      <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
        Approval checklist reminder: confirm the tone is calm and the pairing
        feels appropriate before approving.
      </div>
    </div>
  );
}
