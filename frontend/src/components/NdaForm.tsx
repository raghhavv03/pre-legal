"use client";

import { NdaFormData } from "@/lib/nda";
import PartyFields from "./PartyFields";

type Props = {
  value: NdaFormData;
  onChange: (value: NdaFormData) => void;
  onSubmit: () => void;
};

export default function NdaForm({ value, onChange, onSubmit }: Props) {
  function update<K extends keyof NdaFormData>(key: K, val: NdaFormData[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PartyFields
          label="Party 1"
          value={value.party1}
          onChange={(v) => update("party1", v)}
        />
        <PartyFields
          label="Party 2"
          value={value.party2}
          onChange={(v) => update("party2", v)}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Purpose
        <textarea
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          rows={2}
          value={value.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Effective date
        <input
          type="date"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={value.effectiveDate}
          onChange={(e) => update("effectiveDate", e.target.value)}
          required
        />
      </label>

      <fieldset className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
        <legend className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          MNDA Term
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value.mndaTermType === "fixed"}
            onChange={() => update("mndaTermType", "fixed")}
          />
          Expires
          <input
            type="number"
            min={1}
            className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            value={value.mndaTermYears}
            onChange={(e) => update("mndaTermYears", Number(e.target.value))}
            disabled={value.mndaTermType !== "fixed"}
          />
          year(s) from Effective Date
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value.mndaTermType === "until_terminated"}
            onChange={() => update("mndaTermType", "until_terminated")}
          />
          Continues until terminated
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
        <legend className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Term of Confidentiality
        </legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value.confidentialityTermType === "fixed"}
            onChange={() => update("confidentialityTermType", "fixed")}
          />
          <input
            type="number"
            min={1}
            className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            value={value.confidentialityTermYears}
            onChange={(e) =>
              update("confidentialityTermYears", Number(e.target.value))
            }
            disabled={value.confidentialityTermType !== "fixed"}
          />
          year(s) from Effective Date (trade secrets survive as required by law)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value.confidentialityTermType === "perpetuity"}
            onChange={() => update("confidentialityTermType", "perpetuity")}
          />
          In perpetuity
        </label>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Governing law (state)
          <input
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            value={value.governingLaw}
            onChange={(e) => update("governingLaw", e.target.value)}
            placeholder="Delaware"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Jurisdiction (courts)
          <input
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            value={value.jurisdiction}
            onChange={(e) => update("jurisdiction", e.target.value)}
            placeholder="New Castle, DE"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Generate NDA
      </button>
    </form>
  );
}
