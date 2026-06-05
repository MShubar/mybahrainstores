import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function levelBadgeClass(level: string): string {
  if (level === "error") {
    return "bg-red-100 text-red-700";
  }

  if (level === "warn") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-blue-100 text-blue-700";
}

export function BackofficeMonitoringPage() {
  const summary = useQuery(api.monitoring.queries.getBackofficeMonitoringSummary);

  if (summary === undefined) {
    return <div>Loading monitoring data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monitoring</h1>
        <p className="mt-1 text-gray-600">
          Platform health, audit activity, and error logs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Recent Audit Events</div>
          <div className="mt-2 text-2xl font-bold">{summary.totals.auditLogs}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Recent System Logs</div>
          <div className="mt-2 text-2xl font-bold">{summary.totals.systemLogs}</div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Errors</div>
          <div className="mt-2 text-2xl font-bold text-red-600">
            {summary.totals.errors}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Warnings</div>
          <div className="mt-2 text-2xl font-bold text-yellow-600">
            {summary.totals.warnings}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b bg-gray-50 p-3 font-medium">Recent Errors</div>
          <div className="divide-y">
            {summary.recentSystemLogs
              .filter((log) => log.level === "error")
              .slice(0, 10)
              .map((log) => (
                <div key={log._id} className="p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${levelBadgeClass(log.level)}`}
                    >
                      {log.level}
                    </span>
                    <span className="text-xs text-gray-500">{log.source}</span>
                  </div>
                  <p className="mt-1 font-medium">{log.message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}

            {summary.recentSystemLogs.filter((log) => log.level === "error")
              .length === 0 && (
              <div className="p-4 text-sm text-gray-500">No recent errors.</div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="border-b bg-gray-50 p-3 font-medium">
            Recent Audit Activity
          </div>
          <div className="divide-y">
            {summary.recentAuditLogs.slice(0, 10).map((log) => (
              <div key={log._id} className="p-3 text-sm">
                <p className="font-medium">{log.action}</p>
                <p className="text-gray-600">
                  {log.entity}
                  {log.entityId ? ` · ${log.entityId}` : ""}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {summary.recentAuditLogs.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                No recent audit activity.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
