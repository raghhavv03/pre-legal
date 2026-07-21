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
    <div className="min-h-screen bg-gradient-to-b from-primary-blue/5 via-zinc-50 to-zinc-50 px-6 py-12 dark:from-primary-blue/10 dark:via-black dark:to-black">
      <main className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="border-b-2 border-accent-yellow pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-dark-navy dark:text-white">
            Mutual NDA Creator
          </h1>
          <p className="mt-1 text-sm text-gray-text">
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
              <h2 className="text-xl font-semibold text-dark-navy dark:text-white">
                Document Preview
              </h2>
              <button
                onClick={handleDownload}
                disabled={!complete || isDownloading}
                className="rounded-full bg-secondary-purple px-6 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-secondary-purple/90 disabled:opacity-50 disabled:shadow-none"
              >
                {isDownloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
            {!complete && (
              <p className="text-sm text-gray-text">
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
