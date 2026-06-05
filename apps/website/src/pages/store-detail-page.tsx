import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { SEO } from "../components/seo";
import { getWebAppUrl } from "../lib/web-app-url";

export function StoreDetailPage() {
  const webAppUrl = getWebAppUrl();
  const { storeId } = useParams();
  const trackEvent = useMutation(api.analytics.mutations.trackEvent);
  const trackedStoreId = useRef<string | null>(null);
  const trackedProductIds = useRef<Set<string>>(new Set());

  const store = useQuery(
    api.stores.queries.getById,
    storeId ? { storeId: storeId as Id<"stores"> } : "skip"
  );

  const products = useQuery(
    api.products.queries.listPublicByStore,
    storeId ? { storeId: storeId as Id<"stores"> } : "skip"
  );

  useEffect(() => {
    if (!store?.isApproved || !store.isActive) {
      return;
    }

    if (trackedStoreId.current === store._id) {
      return;
    }

    trackedStoreId.current = store._id;
    void trackEvent({
      event: "store_viewed",
      entityType: "store",
      entityId: store._id,
    });
  }, [store, trackEvent]);

  useEffect(() => {
    if (!products) {
      return;
    }

    for (const product of products) {
      if (trackedProductIds.current.has(product._id)) {
        continue;
      }

      trackedProductIds.current.add(product._id);
      void trackEvent({
        event: "product_viewed",
        entityType: "product",
        entityId: product._id,
      });
    }
  }, [products, trackEvent]);

  if (!storeId) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Missing store.</main>;
  }

  if (store === undefined || products === undefined) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Loading...</main>;
  }

  if (!store || !store.isApproved || !store.isActive) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        Store not found.
      </main>
    );
  }

  return (
    <main>
      <SEO
        title={`${store.name} | RandomStores Bahrain`}
        description={
          store.description ??
          `Browse products from ${store.name} and order for delivery in Bahrain.`
        }
      />
      {store.coverImageUrl && (
        <img
          src={store.coverImageUrl}
          alt={store.name}
          className="h-72 w-full object-cover"
        />
      )}

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex gap-5">
          {store.logoUrl && (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="h-24 w-24 rounded-xl object-cover"
            />
          )}

          <div>
            <h1 className="text-4xl font-bold">{store.name}</h1>
            <p className="mt-2 text-gray-600">{store.description}</p>
            <p className="mt-2 text-sm text-gray-500">{store.address}</p>

            <span
              className={`mt-4 inline-block rounded px-3 py-1 text-sm ${
                store.isOpen
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {store.isOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Products</h2>

          {products.length === 0 && (
            <div className="mt-4 rounded-xl border bg-white p-6 text-gray-600">
              No products available.
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="rounded-xl border bg-white p-5">
                {product.imageUrls[0] && (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="mb-4 h-48 w-full rounded object-cover"
                  />
                )}

                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="mt-4 text-lg font-bold">
                  {product.price.toFixed(3)} BHD
                </div>

                <a
                  href={`${webAppUrl}/signup`}
                  className="mt-4 inline-block w-full rounded bg-black px-4 py-2 text-center text-white"
                >
                  Order in App
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}