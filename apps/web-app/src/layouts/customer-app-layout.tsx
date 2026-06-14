import { ReactNode } from "react";
import { DemoAccountBanner } from "../features/demo/components/demo-account-banner";
import { CustomerBottomNav } from "../features/customer/components/customer-bottom-nav";

export function CustomerAppLayout({
  children,
  hideBottomNav = false,
}: {
  children: ReactNode;
  hideBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className={`mx-auto min-h-screen max-w-lg bg-white shadow-sm ${hideBottomNav ? "pb-6" : "pb-20"}`}>
        <DemoAccountBanner />
        {children}
      </div>
      {hideBottomNav ? null : <CustomerBottomNav />}
    </div>
  );
}
