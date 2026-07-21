"use client";

import { PartyInfo } from "@/lib/nda";

type Props = {
  label: string;
  value: PartyInfo;
  onChange: (value: PartyInfo) => void;
};

export default function PartyFields({ label, value, onChange }: Props) {
  function update<K extends keyof PartyInfo>(key: K, val: PartyInfo[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <legend className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {label}
      </legend>
      <label className="flex flex-col gap-1 text-sm">
        Company name
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={value.companyName}
          onChange={(e) => update("companyName", e.target.value)}
          placeholder="Acme, Inc."
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Signatory name
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={value.signatoryName}
          onChange={(e) => update("signatoryName", e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Signatory title
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={value.signatoryTitle}
          onChange={(e) => update("signatoryTitle", e.target.value)}
          placeholder="CEO"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Notice address (email or postal)
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
          value={value.noticeAddress}
          onChange={(e) => update("noticeAddress", e.target.value)}
          placeholder="legal@acme.com"
          required
        />
      </label>
    </fieldset>
  );
}
