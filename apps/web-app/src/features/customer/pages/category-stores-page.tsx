import { Link, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function CategoryStoresPage() {
  const { categoryId } = useParams();

  const stores = useQuery(
    api.stores.queries.listPublicStoresByCategory,
    categoryId ? { categoryId: categoryId as Id<"categories"> } : "skip"
  );

  if (!categoryId) {
    return <div>Missing category.</div>;
  }

  if (stores === undefined) {
    return <div>Loading stores...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stores</h1>
        <p className="mt-1 text-gray-600">
          Choose a store to view products.
        </p>
      </div>

      {stores.length === 0 && (
        <div className="rounded border bg-white p-5 text-gray-600">
          No approved stores in this category yet.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {stores.map((store) => (
          <Link
            key={store._id}
            to={`/customer/stores/${store._id}`}
            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{store.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{store.address}</p>

            <span
              className={`mt-3 inline-block rounded px-2 py-1 text-xs ${
                store.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {store.isOpen ? "Open" : "Closed"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}