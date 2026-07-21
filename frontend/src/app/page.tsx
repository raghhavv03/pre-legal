"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ChatPanel from "@/components/ChatPanel";
import NdaPreview from "@/components/NdaPreview";
import NdaPdfDocument from "@/components/NdaPdfDocument";
import {
  PartialNdaFormData,
  emptyPartialNdaFormData,
  isNdaFieldsComplete,
  mergeWithDefaults,
} from "@/lib/nda";

export default function Home() {
  const [fields, setFields] = useState<PartialNdaFormData>(emptyPartialNdaFormData);
  const [isDownloading, setIsDownloading] = useState(false);

  const complete = isNdaFieldsComplete(fields);
  const previewData = mergeWithDefaults(fields);

  async function handleDownload() {
    if (!complete) return;
    setIsDownloading(true);
    try {
      const blob = await pdf(<NdaPdfDocument data={previewData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mutual-NDA-${previewData.party1.companyName || "party1"}-${
        previewData.party2.companyName || "party2"
      }.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Mutual NDA Creator
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Chat with the assistant to generate a Common Paper Mutual
            Non-Disclosure Agreement.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-[70vh]">
            <ChatPanel fields={fields} onFieldsChange={setFields} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Document Preview
              </h2>
              <button
                onClick={handleDownload}
                disabled={!complete || isDownloading}
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {isDownloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
            {!complete && (
              <p className="text-sm text-zinc-500">
                Keep chatting — the preview fills in as details are collected.
              </p>
            )}
            <NdaPreview data={previewData} />
          </div>
        </div>
      </main>
    </div>
  );
}
