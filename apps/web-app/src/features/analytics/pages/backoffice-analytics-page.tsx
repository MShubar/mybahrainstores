import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function BackofficeAnalyticsPage() {
  const summary = useQuery(api.analytics.queries.getBackofficeAnalyticsSummary);
  const helpMetrics = useQuery(api.helpArticles.queries.getHelpCenterMetrics);

  if (summary === undefined || helpMetrics === undefined) {
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

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Help article views</div>
          <div className="mt-2 text-2xl font-bold">
            {helpMetrics.helpArticleViews}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Video views</div>
          <div className="mt-2 text-2xl font-bold">
            {helpMetrics.helpVideoViews}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Support tickets</div>
          <div className="mt-2 text-2xl font-bold">
            {helpMetrics.supportTicketsCreated}
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">Store activation rate</div>
          <div className="mt-2 text-2xl font-bold">
            {(helpMetrics.activationRate * 100).toFixed(0)}%
          </div>
        </div>
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
