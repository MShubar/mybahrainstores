import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";

export function BackofficeStoresPage() {
  const stores = useQuery(api.stores.queries.listBackofficeStores);

  const approveStore = useMutation(api.stores.mutations.approveStore);
  const rejectStore = useMutation(api.stores.mutations.rejectStore);
  const toggleStoreActive = useMutation(api.stores.mutations.toggleStoreActive);
  const updateStoreCommissionRate = useMutation(
    api.stores.mutations.updateStoreCommissionRate,
  );
  const trackEvent = useTrackEvent();

  if (stores === undefined) {
    return <div>Loading stores...</div>;
  }

  async function onApprove(storeId: Id<"stores">) {
    await approveStore({ storeId });
    await trackEvent("store_approved", "store", storeId);
  }

  async function onReject(storeId: Id<"stores">) {
    const confirmed = confirm("Reject this store?");
    if (!confirmed) return;

    await rejectStore({ storeId });
  }

  async function onToggleActive(storeId: Id<"stores">, isActive: boolean) {
    await toggleStoreActive({ storeId, isActive });
  }

  async function onCommissionChange(
    storeId: Id<"stores">,
    value: string,
  ) {
    if (value === "default") {
      await updateStoreCommissionRate({ storeId, commissionRate: null });
      return;
    }

    const rate = Number(value);
    if (!Number.isFinite(rate)) {
      return;
    }

    await updateStoreCommissionRate({ storeId, commissionRate: rate });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stores</h1>
        <p className="mt-1 text-gray-600">
          Review, approve, reject, and manage store listings.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Store</th>
              <th className="p-3">Slug</th>
              <th className="p-3">City</th>
              <th className="p-3">Approved</th>
              <th className="p-3">Active</th>
              <th className="p-3">Open</th>
              <th className="p-3">Commission</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stores.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>
                  No stores yet.
                </td>
              </tr>
            )}

            {stores.map((store) => (
              <tr key={store._id} className="border-b">
                <td className="p-3">
                  <div className="font-medium">{store.name}</div>
                  <div className="text-xs text-gray-500">{store.address}</div>
                </td>

                <td className="p-3 text-gray-600">{store.slug}</td>
                <td className="p-3">{store.city}</td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      store.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {store.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    className={`rounded px-2 py-1 text-xs ${
                      store.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => onToggleActive(store._id, !store.isActive)}
                  >
                    {store.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="p-3">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      store.isOpen
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {store.isOpen ? "Open" : "Closed"}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    className="rounded border px-2 py-1"
                    value={
                      store.commissionRate !== undefined
                        ? String(store.commissionRate)
                        : "default"
                    }
                    onChange={(event) =>
                      void onCommissionChange(store._id, event.target.value)
                    }
                  >
                    <option value="default">Default</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </select>
                </td>

                <td className="space-x-2 p-3 text-right">
                  {!store.isApproved && (
                    <button
                      className="rounded bg-black px-3 py-1 text-white"
                      onClick={() => onApprove(store._id)}
                    >
                      Approve
                    </button>
                  )}

                  {store.isApproved && (
                    <button
                      className="rounded border px-3 py-1"
                      onClick={() => onReject(store._id)}
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}