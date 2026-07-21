import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  NdaFormData,
  STANDARD_TERMS_CLAUSES,
  confidentialityTermText,
  formatDate,
  mndaTermText,
  resolvedClauseBody,
} from "@/lib/nda";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", lineHeight: 1.5 },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 16 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 4 },
  label: { fontSize: 9, fontFamily: "Helvetica-Oblique", color: "#555", marginBottom: 2 },
  paragraph: { marginBottom: 8 },
  clauseTitle: { fontFamily: "Helvetica-Bold" },
  table: { marginTop: 12, borderTop: "1pt solid #ccc" },
  tableRow: { flexDirection: "row", borderBottom: "1pt solid #ccc" },
  tableCellLabel: { width: "20%", padding: 6, fontFamily: "Helvetica-Bold" },
  tableCell: { width: "40%", padding: 6, borderLeft: "1pt solid #ccc" },
  footer: { marginTop: 20, fontSize: 8, color: "#777" },
});

export default function NdaPdfDocument({ data }: { data: NdaFormData }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>Mutual Non-Disclosure Agreement</Text>

        <Text style={styles.h2}>Purpose</Text>
        <Text style={styles.label}>How Confidential Information may be used</Text>
        <Text style={styles.paragraph}>{data.purpose}</Text>

        <Text style={styles.h2}>Effective Date</Text>
        <Text style={styles.paragraph}>{formatDate(data.effectiveDate)}</Text>

        <Text style={styles.h2}>MNDA Term</Text>
        <Text style={styles.label}>The length of this MNDA</Text>
        <Text style={styles.paragraph}>{mndaTermText(data)}</Text>

        <Text style={styles.h2}>Term of Confidentiality</Text>
        <Text style={styles.label}>How long Confidential Information is protected</Text>
        <Text style={styles.paragraph}>{confidentialityTermText(data)}</Text>

        <Text style={styles.h2}>Governing Law &amp; Jurisdiction</Text>
        <Text style={styles.paragraph}>
          Governing Law: {data.governingLaw || "[Fill in state]"}
        </Text>
        <Text style={styles.paragraph}>
          Jurisdiction: {data.jurisdiction || "[Fill in city or county and state]"}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel} />
            <Text style={styles.tableCell}>Party 1</Text>
            <Text style={styles.tableCell}>Party 2</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Print Name</Text>
            <Text style={styles.tableCell}>{data.party1.signatoryName}</Text>
            <Text style={styles.tableCell}>{data.party2.signatoryName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Title</Text>
            <Text style={styles.tableCell}>{data.party1.signatoryTitle}</Text>
            <Text style={styles.tableCell}>{data.party2.signatoryTitle}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Company</Text>
            <Text style={styles.tableCell}>{data.party1.companyName}</Text>
            <Text style={styles.tableCell}>{data.party2.companyName}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Notice Address</Text>
            <Text style={styles.tableCell}>{data.party1.noticeAddress}</Text>
            <Text style={styles.tableCell}>{data.party2.noticeAddress}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLabel}>Date</Text>
            <Text style={styles.tableCell}>{formatDate(data.effectiveDate)}</Text>
            <Text style={styles.tableCell}>{formatDate(data.effectiveDate)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
          under CC BY 4.0.
        </Text>
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.h1}>Standard Terms</Text>
        {STANDARD_TERMS_CLAUSES.map((clause, i) => (
          <Text key={clause.title} style={styles.paragraph}>
            <Text style={styles.clauseTitle}>
              {i + 1}. {clause.title}.{" "}
            </Text>
            {resolvedClauseBody(clause.body, data)}
          </Text>
        ))}
        <Text style={styles.footer}>
          Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use
          under CC BY 4.0.
        </Text>
      </Page>
    </Document>
  );
}
