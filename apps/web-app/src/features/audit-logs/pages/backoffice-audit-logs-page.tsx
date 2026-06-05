import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function BackofficeAuditLogsPage() {
  const logs = useQuery(api.auditLogs.queries.listBackofficeAuditLogs);

  if (logs === undefined) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="mt-1 text-gray-600">
          Track important platform changes and admin actions.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Entity ID</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-gray-500">
                  No audit logs yet.
                </td>
              </tr>
            )}

            {logs.map((log) => (
              <tr key={log._id} className="border-b">
                <td className="p-3 font-medium">{log.action}</td>
                <td className="p-3">{log.entity}</td>
                <td className="p-3 text-xs text-gray-500">
                  {log.entityId ?? "-"}
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {log.actorId ?? "System"}
                </td>
                <td className="p-3 text-gray-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}