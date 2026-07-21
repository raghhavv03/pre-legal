import {
  NdaFormData,
  STANDARD_TERMS_CLAUSES,
  confidentialityTermText,
  formatDate,
  mndaTermText,
  resolvedClauseBody,
} from "@/lib/nda";

export default function NdaPreview({ data }: { data: NdaFormData }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">Mutual Non-Disclosure Agreement</h2>

      <section>
        <h3 className="font-semibold">Purpose</h3>
        <p>{data.purpose}</p>
      </section>

      <section>
        <h3 className="font-semibold">Effective Date</h3>
        <p>{formatDate(data.effectiveDate)}</p>
      </section>

      <section>
        <h3 className="font-semibold">MNDA Term</h3>
        <p>{mndaTermText(data)}</p>
      </section>

      <section>
        <h3 className="font-semibold">Term of Confidentiality</h3>
        <p>{confidentialityTermText(data)}</p>
      </section>

      <section>
        <h3 className="font-semibold">Governing Law &amp; Jurisdiction</h3>
        <p>Governing Law: {data.governingLaw || "[Fill in state]"}</p>
        <p>Jurisdiction: {data.jurisdiction || "[Fill in city or county and state]"}</p>
      </section>

      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr>
            <th className="border border-zinc-300 p-2 dark:border-zinc-700" />
            <th className="border border-zinc-300 p-2 dark:border-zinc-700">Party 1</th>
            <th className="border border-zinc-300 p-2 dark:border-zinc-700">Party 2</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Print Name", data.party1.signatoryName, data.party2.signatoryName],
            ["Title", data.party1.signatoryTitle, data.party2.signatoryTitle],
            ["Company", data.party1.companyName, data.party2.companyName],
            ["Notice Address", data.party1.noticeAddress, data.party2.noticeAddress],
            ["Date", formatDate(data.effectiveDate), formatDate(data.effectiveDate)],
          ].map(([label, v1, v2]) => (
            <tr key={label}>
              <td className="border border-zinc-300 p-2 font-medium dark:border-zinc-700">
                {label}
              </td>
              <td className="border border-zinc-300 p-2 dark:border-zinc-700">{v1}</td>
              <td className="border border-zinc-300 p-2 dark:border-zinc-700">{v2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4 text-lg font-semibold">Standard Terms</h2>
      {STANDARD_TERMS_CLAUSES.map((clause, i) => (
        <p key={clause.title}>
          <span className="font-semibold">
            {i + 1}. {clause.title}.{" "}
          </span>
          {resolvedClauseBody(clause.body, data)}
        </p>
      ))}
    </article>
  );
}
