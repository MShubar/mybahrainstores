import { privacyPolicy } from "@my-bahrain/content";
import { PageHeader } from "../../customer/components/page-header";
import { LegalDocumentView } from "../components/legal-document-view";

export function CustomerPrivacyPage() {
  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <PageHeader title={privacyPolicy.title} subtitle="How we handle your personal data." />
      <div className="px-4 pt-4">
        <LegalDocumentView document={privacyPolicy} />
      </div>
    </div>
  );
}
