"use client";

import { useState } from "react";
import { PartialNdaFormData, emptyPartialNdaFormData } from "@/lib/nda";

const API_BASE = "http://localhost:8000";

type ChatTurn = { role: "user" | "assistant"; content: string };

// Wire format matches the backend's flat NdaFields schema -- the local model
// (qwen3:8b) fills flat top-level keys far more reliably than nested objects
// under structured-output constraints.
type FlatNdaFields = {
  party1CompanyName?: string | null;
  party1SignatoryName?: string | null;
  party1SignatoryTitle?: string | null;
  party1NoticeAddress?: string | null;
  party2CompanyName?: string | null;
  party2SignatoryName?: string | null;
  party2SignatoryTitle?: string | null;
  party2NoticeAddress?: string | null;
  purpose?: string | null;
  effectiveDate?: string | null;
  mndaTermType?: "fixed" | "until_terminated" | null;
  mndaTermYears?: number | null;
  confidentialityTermType?: "fixed" | "perpetuity" | null;
  confidentialityTermYears?: number | null;
  governingLaw?: string | null;
  jurisdiction?: string | null;
};

function omitNullish<T extends object>(
  obj: T
): Partial<{ [K in keyof T]: NonNullable<T[K]> }> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)
  ) as Partial<{ [K in keyof T]: NonNullable<T[K]> }>;
}

function toFlatFields(fields: PartialNdaFormData): FlatNdaFields {
  return {
    party1CompanyName: fields.party1.companyName,
    party1SignatoryName: fields.party1.signatoryName,
    party1SignatoryTitle: fields.party1.signatoryTitle,
    party1NoticeAddress: fields.party1.noticeAddress,
    party2CompanyName: fields.party2.companyName,
    party2SignatoryName: fields.party2.signatoryName,
    party2SignatoryTitle: fields.party2.signatoryTitle,
    party2NoticeAddress: fields.party2.noticeAddress,
    purpose: fields.purpose,
    effectiveDate: fields.effectiveDate,
    mndaTermType: fields.mndaTermType,
    mndaTermYears: fields.mndaTermYears,
    confidentialityTermType: fields.confidentialityTermType,
    confidentialityTermYears: fields.confidentialityTermYears,
    governingLaw: fields.governingLaw,
    jurisdiction: fields.jurisdiction,
  };
}

function fromFlatFields(flat: FlatNdaFields): PartialNdaFormData {
  const {
    party1CompanyName,
    party1SignatoryName,
    party1SignatoryTitle,
    party1NoticeAddress,
    party2CompanyName,
    party2SignatoryName,
    party2SignatoryTitle,
    party2NoticeAddress,
    ...rest
  } = flat;

  return {
    party1: omitNullish({
      companyName: party1CompanyName,
      signatoryName: party1SignatoryName,
      signatoryTitle: party1SignatoryTitle,
      noticeAddress: party1NoticeAddress,
    }),
    party2: omitNullish({
      companyName: party2CompanyName,
      signatoryName: party2SignatoryName,
      signatoryTitle: party2SignatoryTitle,
      noticeAddress: party2NoticeAddress,
    }),
    ...omitNullish(rest),
  };
}

const GREETING: ChatTurn = {
  role: "assistant",
  content:
    "Hi! I'll help you put together a Mutual NDA. Let's start with the two companies involved — what are their names?",
};

type Props = {
  fields: PartialNdaFormData;
  onFieldsChange: (fields: PartialNdaFormData) => void;
};

export default function ChatPanel({ fields, onFieldsChange }: Props) {
  const [messages, setMessages] = useState<ChatTurn[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(e: React.SubmitEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/chat/nda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Backend only keeps the last few turns -- sending the full transcript here is fine,
          // it bounds it server-side rather than duplicating that constant in two places.
          messages: nextMessages.filter((m) => m !== GREETING),
          fields: toFlatFields(fields ?? emptyPartialNdaFormData),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data: { reply: string; fields: FlatNdaFields } = await res.json();

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      onFieldsChange(fromFlatFields(data.fields));
    } catch {
      setError("Couldn't reach the AI assistant. Is Ollama running?");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-primary-blue/20 bg-white p-4 shadow-lg dark:border-primary-blue/30 dark:bg-zinc-950">
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.role === "user"
                ? "self-end bg-primary-blue text-white"
                : "self-start border border-dark-navy/10 bg-dark-navy/5 text-dark-navy dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 self-start text-sm text-gray-text">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-yellow" />
            Thinking…
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue dark:border-zinc-600 dark:bg-zinc-900"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="rounded-full bg-secondary-purple px-5 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-secondary-purple/90 disabled:opacity-50 disabled:shadow-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}
