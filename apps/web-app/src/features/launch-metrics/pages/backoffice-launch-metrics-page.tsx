import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function MetricCard({
  label,
  value,
  target,
}: {
  label: string;
  value: number | string;
  target?: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {target !== undefined ? (
        <div className="mt-2 text-xs text-gray-500">Target: {target}</div>
      ) : null}
    </div>
  );
}

function ProgressBar({ label, current, target }: { label: string; current: number; target: number }) {
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {current} / {target}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-black"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function BackofficeLaunchMetricsPage() {
  const metrics = useQuery(api.launchMetrics.queries.getLaunchMetrics);

  if (metrics === undefined) {
    return <div>Loading launch metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Launch Metrics</h1>
        <p className="mt-1 text-gray-600">
          Track acquisition and marketplace readiness before paid marketing.
        </p>
      </div>

      <div
        className={`rounded-xl border p-5 ${
          metrics.launchReady
            ? "border-green-300 bg-green-50"
            : "border-amber-300 bg-amber-50"
        }`}
      >
        <h2 className="text-lg font-semibold">
          {metrics.launchReady
            ? "Launch targets met"
            : "Launch targets in progress"}
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Aim for {metrics.targets.stores}+ stores, {metrics.targets.products}+
          products, {metrics.targets.customers}+ customers, and{" "}
          {metrics.targets.orders}+ orders before spending on ads.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Launch readiness</h2>
        <ProgressBar
          label="Approved stores"
          current={metrics.approvedStores}
          target={metrics.targets.stores}
        />
        <ProgressBar
          label="Active products"
          current={metrics.products}
          target={metrics.targets.products}
        />
        <ProgressBar
          label="Active customers"
          current={metrics.activeCustomers}
          target={metrics.targets.customers}
        />
        <ProgressBar
          label="Orders"
          current={metrics.orders}
          target={metrics.targets.orders}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Acquisition</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Store leads" value={metrics.storeLeads} />
          <MetricCard
            label="Active leads"
            value={metrics.storeLeadsPending}
          />
          <MetricCard
            label="Approved stores"
            value={metrics.approvedStores}
            target={metrics.targets.stores}
          />
          <MetricCard
            label="Active customers"
            value={metrics.activeCustomers}
            target={metrics.targets.customers}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Marketplace activity</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Products"
            value={metrics.products}
            target={metrics.targets.products}
          />
          <MetricCard
            label="Orders"
            value={metrics.orders}
            target={metrics.targets.orders}
          />
          <MetricCard label="Paid orders" value={metrics.paidOrders} />
          <MetricCard label="Total stores" value={metrics.totalStores} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Revenue</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="GMV"
            value={`${metrics.gmv.toFixed(3)} BHD`}
          />
          <MetricCard
            label="Commission revenue"
            value={`${metrics.commissionRevenue.toFixed(3)} BHD`}
          />
          <MetricCard
            label="Store revenue"
            value={`${metrics.storeRevenue.toFixed(3)} BHD`}
          />
        </div>
      </section>
    </div>
  );
}
