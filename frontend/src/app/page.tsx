"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import NdaPdfDocument from "@/components/NdaPdfDocument";
import { NdaFormData, defaultNdaFormData } from "@/lib/nda";

export default function Home() {
  const [formData, setFormData] = useState<NdaFormData>(defaultNdaFormData);
  const [generated, setGenerated] = useState<NdaFormData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (!generated) return;
    setIsDownloading(true);
    try {
      const blob = await pdf(<NdaPdfDocument data={generated} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Mutual-NDA-${generated.party1.companyName || "party1"}-${
        generated.party2.companyName || "party2"
      }.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Mutual NDA Creator
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Fill in the details below to generate a Common Paper Mutual
            Non-Disclosure Agreement.
          </p>
        </header>

        <NdaForm
          value={formData}
          onChange={setFormData}
          onSubmit={() => setGenerated(formData)}
        />

        {generated && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Generated NDA
              </h2>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {isDownloading ? "Preparing PDF…" : "Download PDF"}
              </button>
            </div>
            <NdaPreview data={generated} />
          </div>
        )}
      </main>
    </div>
  );
}
