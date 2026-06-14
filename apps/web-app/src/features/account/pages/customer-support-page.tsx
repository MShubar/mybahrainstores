import { PageHeader } from "../../customer/components/page-header";
import { SupportPage } from "../../support/pages/support-page";

export function CustomerSupportPage() {
  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <PageHeader title="Help & support" subtitle="Contact us or view your tickets." />
      <div className="px-4 pt-4">
        <SupportPage embedded />
      </div>
    </div>
  );
}
