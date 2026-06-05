import { Link, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { SEO } from "../components/seo";

export function CategoryDetailPage() {
  const { categoryId } = useParams();

  const category = useQuery(
    api.categories.queries.getById,
    categoryId ? { categoryId: categoryId as Id<"categories"> } : "skip"
  );

  const stores = useQuery(
    api.stores.queries.listPublicStoresByCategory,
    categoryId ? { categoryId: categoryId as Id<"categories"> } : "skip"
  );

  if (!categoryId) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Missing category.</main>;
  }

  if (category === undefined || stores === undefined) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Loading...</main>;
  }

  if (!category || !category.isActive) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        Category not found.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SEO
        title={`${category.name} Stores | RandomStores Bahrain`}
        description={
          category.description ??
          `Discover approved stores in the ${category.name} category across Bahrain.`
        }
      />
      <section>
        {category.imageUrl && (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="mb-6 h-64 w-full rounded-xl object-cover"
          />
        )}

        <h1 className="text-4xl font-bold">{category.name}</h1>

        {category.description && (
          <p className="mt-3 max-w-2xl text-gray-600">
            {category.description}
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Stores</h2>

        {stores.length === 0 && (
          <div className="mt-4 rounded-xl border bg-white p-6 text-gray-600">
            No stores available in this category yet.
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store._id}
              to={`/stores/${store._id}`}
              className="rounded-xl border bg-white p-5 hover:bg-gray-50"
            >
              {store.logoUrl && (
                <img
                  src={store.logoUrl}
                  alt={store.name}
                  className="mb-4 h-20 w-20 rounded object-cover"
                />
              )}

              <h3 className="text-xl font-bold">{store.name}</h3>

              <p className="mt-2 text-sm text-gray-600">
                {store.description}
              </p>

              <p className="mt-2 text-sm text-gray-500">{store.address}</p>

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
      </section>
    </main>
  );
}