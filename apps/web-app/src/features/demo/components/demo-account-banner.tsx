import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function DemoAccountBanner() {
  const isDemoAccount = useQuery(api.demo.queries.isCurrentUserDemoAccount);

  if (!isDemoAccount) {
    return null;
  }

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-6 py-3 text-sm text-amber-900">
      <strong>Demo Account</strong> — Changes may be reset periodically.
    </div>
  );
}
