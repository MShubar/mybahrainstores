import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function toTimestamp(value: string): number | undefined {
  if (!value) {
    return undefined;
  }

  return new Date(value).getTime();
}

export function BackofficeRevenueReportPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const args = useMemo(
    () => ({
      from: toTimestamp(from),
      to: toTimestamp(to),
    }),
    [from, to],
  );

  const report = useQuery(api.reports.queries.getRevenueReport, args);

  if (report === undefined) {
    return <div>Loading revenue report...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Revenue Reports</h1>
        <p className="mt-1 text-gray-600">
          Track GMV, platform commission, store earnings, and pending revenue.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Date Filter</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            type="date"
            className="rounded border p-2"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />

          <input
            type="date"
            className="rounded border p-2"
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">GMV</div>
          <div className="mt-2 text-2xl font-bold">
            {report.gmv.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Platform Revenue</div>
          <div className="mt-2 text-2xl font-bold">
            {report.platformRevenue.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Store Earnings</div>
          <div className="mt-2 text-2xl font-bold">
            {report.storeEarnings.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Pending Revenue</div>
          <div className="mt-2 text-2xl font-bold">
            {report.pendingRevenue.toFixed(3)} BHD
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-500">Refunded</div>
          <div className="mt-2 text-2xl font-bold">
            {report.refundedRevenue.toFixed(3)} BHD
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div>
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{report.totalOrders}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Paid Orders</div>
            <div className="text-2xl font-bold">{report.paidOrders}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Pending Orders</div>
            <div className="text-2xl font-bold">{report.pendingOrders}</div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Refunded Orders</div>
            <div className="text-2xl font-bold">{report.refundedOrders}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
