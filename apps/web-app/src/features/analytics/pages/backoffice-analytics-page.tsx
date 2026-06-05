import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function BackofficeAnalyticsPage() {
  const summary = useQuery(api.analytics.queries.getBackofficeAnalyticsSummary);

  if (summary === undefined) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-gray-600">Basic platform event tracking.</p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <div className="text-sm text-gray-500">Total Events</div>
        <div className="mt-2 text-3xl font-bold">{summary.totalEvents}</div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Events</h2>

        <div className="mt-4 space-y-2">
          {Object.entries(summary.countsByEvent).length === 0 && (
            <p className="text-gray-600">No events recorded yet.</p>
          )}

          {Object.entries(summary.countsByEvent).map(([event, count]) => (
            <div key={event} className="flex justify-between border-b py-2">
              <span>{event}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
