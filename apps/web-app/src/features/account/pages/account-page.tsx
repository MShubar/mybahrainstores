import { useQuery } from "convex/react";
import { CustomerAppLayout } from "../../../layouts/customer-app-layout";
import { AccountSettingsPage } from "./account-settings-page";
import { CustomerAccountPage } from "./customer-account-page";
import { api } from "@convex/_generated/api";

export function AccountPage() {
  const user = useQuery(api.users.queries.me);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] text-gray-500">
        Loading account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7] text-gray-500">
        Sign in to view your account.
      </div>
    );
  }

  if (user.role === "customer") {
    return (
      <CustomerAppLayout>
        <CustomerAccountPage />
      </CustomerAppLayout>
    );
  }

  return <AccountSettingsPage />;
}
