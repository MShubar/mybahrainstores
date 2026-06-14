import { termsAndConditions } from "@my-bahrain/content";
import { PageHeader } from "../../customer/components/page-header";
import { LegalDocumentView } from "../components/legal-document-view";

export function CustomerTermsPage() {
  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <PageHeader title={termsAndConditions.title} subtitle="Rules for using the platform." />
      <div className="px-4 pt-4">
        <LegalDocumentView document={termsAndConditions} />
      </div>
    </div>
  );
}
