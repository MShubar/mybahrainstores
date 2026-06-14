import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Link } from "react-router-dom";
import { ImageUploadField } from "../../files/components/image-upload-field";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";
type StoreForm = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  categoryIds: Id<"categories">[];
  address: string;
  city: string;
  area: string;
  isOpen: boolean;
};

const initialForm: StoreForm = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  coverImageUrl: "",
  categoryIds: [],
  address: "",
  city: "Manama",
  area: "",
  isOpen: false,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function StoreDashboardPage() {
  const categories = useQuery(api.categories.queries.listPublic);
  const myStore = useQuery(api.stores.queries.getMyStore);

  const createMyStore = useMutation(api.stores.mutations.createMyStore);
  const updateMyStore = useMutation(api.stores.mutations.updateMyStore);
  const trackEvent = useTrackEvent();

  const [form, setForm] = useState<StoreForm>(initialForm);
  const [hydratedStoreId, setHydratedStoreId] =
    useState<Id<"stores"> | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const stats = useQuery(api.stores.queries.getMyStoreDashboardStats);
  const revenueStats = useQuery(api.orders.queries.getMyStoreRevenueStats);
  const payoutData = useQuery(api.payouts.queries.listMyStorePayouts);

  if (myStore && hydratedStoreId !== myStore._id) {
    setHydratedStoreId(myStore._id);
    setForm({
      name: myStore.name,
      slug: myStore.slug,
      description: myStore.description ?? "",
      logoUrl: myStore.logoUrl ?? "",
      coverImageUrl: myStore.coverImageUrl ?? "",
      categoryIds: myStore.categoryIds,
      address: myStore.address,
      city: myStore.city,
      area: myStore.area ?? "",
      isOpen: myStore.isOpen,
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || makeSlug(form.name),
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
        coverImageUrl: form.coverImageUrl || undefined,
        categoryIds: form.categoryIds,
        address: form.address,
        city: form.city,
        area: form.area || undefined,
        isOpen: form.isOpen,
      };

      if (myStore) {
        await updateMyStore({
          storeId: myStore._id,
          ...payload,
        });
      } else {
        const storeId = await createMyStore(payload);
        await trackEvent("store_created", "store", storeId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save store");
    } finally {
      setLoading(false);
    }
  }

  if (categories === undefined || myStore === undefined) {
    return <div>Loading store dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Profile</h1>
        <p className="mt-1 text-gray-600">
          Create and manage your store listing.
        </p>
      </div>

      {myStore && (
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm">
            Approval Status:{" "}
            <span
              className={`rounded px-2 py-1 text-xs ${
                myStore.isApproved
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {myStore.isApproved ? "Approved" : "Pending approval"}
            </span>
          </p>
        </div>
      )}

{stats && (
  <div className="grid gap-4 md:grid-cols-4">
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Products</div>
      <div className="mt-2 text-2xl font-bold">{stats.totalProducts}</div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Active Products</div>
      <div className="mt-2 text-2xl font-bold">{stats.activeProducts}</div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Orders</div>
      <div className="mt-2 text-2xl font-bold">{stats.totalOrders}</div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Pending Orders</div>
      <div className="mt-2 text-2xl font-bold">{stats.pendingOrders}</div>
    </div>
  </div>
)}
{revenueStats && (
  <div className="grid gap-4 md:grid-cols-4">
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Gross revenue</div>
      <div className="mt-2 text-2xl font-bold">
        {revenueStats.grossRevenue.toFixed(3)} BHD
      </div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Commission paid</div>
      <div className="mt-2 text-2xl font-bold">
        {revenueStats.commissionPaid.toFixed(3)} BHD
      </div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Net earnings</div>
      <div className="mt-2 text-2xl font-bold">
        {revenueStats.netEarnings.toFixed(3)} BHD
      </div>
    </div>

    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-gray-500">Paid orders</div>
      <div className="mt-2 text-2xl font-bold">{revenueStats.paidOrders}</div>
    </div>
  </div>
)}

{payoutData && (
  <div className="rounded-xl border bg-white p-5">
    <h2 className="text-lg font-semibold">Payouts</h2>
    <p className="mt-1 text-sm text-gray-600">
      Commission rate:{" "}
      {payoutData.store.commissionRate !== null
        ? `${payoutData.store.commissionRate}%`
        : "Platform default"}
      . Amount owed: {payoutData.balance.amountOwed.toFixed(3)} BHD
    </p>

    {payoutData.payouts.length === 0 ? (
      <p className="mt-4 text-sm text-gray-500">No payouts recorded yet.</p>
    ) : (
      <table className="mt-4 w-full text-left text-sm">
        <thead className="border-b">
          <tr>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {payoutData.payouts.map((payout) => (
            <tr key={payout._id} className="border-b">
              <td className="py-2">
                {new Date(payout.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2">
                {payout.amount.toFixed(3)} {payout.currency}
              </td>
              <td className="py-2">{payout.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}
<div className="flex flex-wrap gap-3">
  <Link to="/store/products" className="rounded bg-black px-4 py-2 text-white">
    Manage Products
  </Link>

  <Link to="/store/orders" className="rounded border px-4 py-2">
    View Orders
  </Link>

  <Link to="/store/payout-settings" className="rounded border px-4 py-2">
    Payout Information
  </Link>
</div>
      <form onSubmit={onSubmit} className="rounded-xl border bg-white p-5">
        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="Store name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: makeSlug(e.target.value),
              }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
          />

<ImageUploadField
  label="Store Logo"
  value={form.logoUrl}
  entityType="store"
  entityId={myStore?._id}
  onChange={(url) =>
    setForm((prev) => ({
      ...prev,
      logoUrl: url,
    }))
  }
/>

<ImageUploadField
  label="Store Cover Image"
  value={form.coverImageUrl}
  entityType="store"
  entityId={myStore?._id}
  onChange={(url) =>
    setForm((prev) => ({
      ...prev,
      coverImageUrl: url,
    }))
  }
/>

          <input
            className="rounded border p-2"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Area"
            value={form.area}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, area: e.target.value }))
            }
          />

          <input
            className="rounded border p-2 md:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address: e.target.value }))
            }
          />

          <textarea
            className="rounded border p-2 md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Categories</p>

            <div className="grid gap-2 md:grid-cols-3">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(category._id)}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        categoryIds: e.target.checked
                          ? [...prev.categoryIds, category._id]
                          : prev.categoryIds.filter(
                              (id) => id !== category._id
                            ),
                      }));
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isOpen: e.target.checked }))
              }
            />
            Store is open
          </label>
        </div>

        <button
          disabled={loading}
          className="mt-5 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : myStore ? "Update Store" : "Create Store"}
        </button>
      </form>
    </div>
  );
}