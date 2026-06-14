import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function BackofficePayoutsPage() {
  const overview = useQuery(api.payouts.queries.listBackofficePayoutOverview);
  const payouts = useQuery(api.payouts.queries.listBackofficePayouts);

  const createStorePayout = useMutation(api.payouts.mutations.createStorePayout);
  const markPayoutPaid = useMutation(api.payouts.mutations.markPayoutPaid);
  const updatePayoutInfoStatus = useMutation(
    api.stores.mutations.updateStorePayoutInfoStatus,
  );

  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (overview === undefined || payouts === undefined) {
    return <div>Loading payouts...</div>;
  }

  async function handleCreatePayout(storeId: Id<"stores">, maxAmount: number) {
    const rawAmount = amounts[storeId] ?? String(maxAmount);
    const amount = Number(rawAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payout amount");
      return;
    }

    setError("");
    setPendingId(storeId);

    try {
      await createStorePayout({ storeId, amount });
      setAmounts((prev) => ({ ...prev, [storeId]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create payout");
    } finally {
      setPendingId(null);
    }
  }

  async function handleMarkPaid(payoutId: Id<"payouts">) {
    const confirmed = confirm("Mark this payout as paid?");
    if (!confirmed) {
      return;
    }

    setPendingId(payoutId);
    try {
      await markPayoutPaid({ payoutId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payout");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="mt-1 text-gray-600">
          Manual payout workflow: review bank details, transfer offline, then
          create payout and mark paid. Automated transfers are Phase 2.
        </p>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Payout bank details</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Store</th>
              <th className="p-3">Bank / IBAN</th>
              <th className="p-3">Holder</th>
              <th className="p-3">Info status</th>
              <th className="p-3 text-right">Review</th>
            </tr>
          </thead>
          <tbody>
            {overview
              .filter(
                (row) =>
                  row.store.bankName ||
                  row.store.payoutInfoStatus !== "not_submitted",
              )
              .map((row) => (
                <tr key={`bank-${row.store._id}`} className="border-b">
                  <td className="p-3 font-medium">{row.store.name}</td>
                  <td className="p-3 font-mono text-xs">
                    {row.store.bankName ? (
                      <>
                        <div>{row.store.bankName}</div>
                        <div className="text-gray-500">{row.store.iban}</div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3">{row.store.accountHolderName ?? "—"}</td>
                  <td className="p-3 capitalize">
                    {row.store.payoutInfoStatus.replace(/_/g, " ")}
                  </td>
                  <td className="space-x-2 p-3 text-right">
                    {row.store.payoutInfoStatus === "pending" ? (
                      <>
                        <button
                          type="button"
                          className="rounded border px-2 py-1"
                          onClick={() =>
                            void updatePayoutInfoStatus({
                              storeId: row.store._id,
                              status: "approved",
                            })
                          }
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded border px-2 py-1"
                          onClick={() =>
                            void updatePayoutInfoStatus({
                              storeId: row.store._id,
                              status: "rejected",
                            })
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Store balances</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Store</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Gross earnings</th>
              <th className="p-3">Paid out</th>
              <th className="p-3">Amount owed</th>
              <th className="p-3">Orders</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {overview.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={7}>
                  No store earnings yet.
                </td>
              </tr>
            ) : null}

            {overview.map((row) => (
              <tr key={row.store._id} className="border-b">
                <td className="p-3 font-medium">{row.store.name}</td>
                <td className="p-3">
                  {row.store.commissionRate !== null
                    ? `${row.store.commissionRate}%`
                    : "Default"}
                </td>
                <td className="p-3">{row.balance.grossEarnings.toFixed(3)} BHD</td>
                <td className="p-3">{row.balance.paidOut.toFixed(3)} BHD</td>
                <td className="p-3 font-medium">
                  {row.balance.amountOwed.toFixed(3)} BHD
                </td>
                <td className="p-3">{row.balance.paidOrderCount}</td>
                <td className="space-y-2 p-3 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={amounts[row.store._id] ?? ""}
                    placeholder={row.balance.amountOwed.toFixed(3)}
                    onChange={(event) =>
                      setAmounts((prev) => ({
                        ...prev,
                        [row.store._id]: event.target.value,
                      }))
                    }
                    className="w-full rounded border px-2 py-1"
                    disabled={row.balance.amountOwed <= 0 || pendingId === row.store._id}
                  />
                  <button
                    type="button"
                    disabled={row.balance.amountOwed <= 0 || pendingId === row.store._id}
                    onClick={() =>
                      void handleCreatePayout(row.store._id, row.balance.amountOwed)
                    }
                    className="w-full rounded bg-black px-3 py-1 text-white disabled:opacity-50"
                  >
                    Create payout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-4 py-3">
          <h2 className="font-semibold">Payout history</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Store</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Paid at</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No payouts recorded yet.
                </td>
              </tr>
            ) : null}

            {payouts.map((payout) => (
              <tr key={payout._id} className="border-b">
                <td className="p-3">{payout.storeName}</td>
                <td className="p-3">
                  {payout.amount.toFixed(3)} {payout.currency}
                </td>
                <td className="p-3">{payout.status}</td>
                <td className="p-3">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {payout.paidAt
                    ? new Date(payout.paidAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3 text-right">
                  {payout.status !== "paid" ? (
                    <button
                      type="button"
                      disabled={pendingId === payout._id}
                      onClick={() => void handleMarkPaid(payout._id)}
                      className="rounded border px-3 py-1"
                    >
                      Mark paid
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
