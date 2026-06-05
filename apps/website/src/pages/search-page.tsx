import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SEO } from "../components/seo";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";

  const stores = useQuery(
    api.stores.queries.searchPublicStores,
    search ? { search } : "skip"
  );

  const products = useQuery(
    api.products.queries.searchPublicProducts,
    search ? { search } : "skip"
  );

  function updateSearch(value: string) {
    setParams(value ? { q: value } : {});
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SEO
        title={
          search
            ? `Search: ${search} | RandomStores Bahrain`
            : "Search Stores & Products | RandomStores Bahrain"
        }
        description={
          search
            ? `Search results for "${search}" across Bahrain stores and products.`
            : "Search approved Bahrain stores and products available for delivery."
        }
      />
      <h1 className="text-4xl font-bold">Search</h1>

      <input
        className="mt-6 w-full rounded border p-3"
        placeholder="Search stores or products..."
        value={search}
        onChange={(e) => updateSearch(e.target.value)}
      />

      {!search && (
        <p className="mt-6 text-gray-600">
          Type something to search stores and products.
        </p>
      )}

      {search && (stores === undefined || products === undefined) && (
        <p className="mt-6 text-gray-600">Searching...</p>
      )}

      {search && stores && products && (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="text-2xl font-bold">Stores</h2>

            {stores.length === 0 && (
              <p className="mt-3 text-gray-600">No stores found.</p>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {stores.map((store) => (
                <Link
                  key={store._id}
                  to={`/stores/${store._id}`}
                  className="rounded-xl border bg-white p-5 hover:bg-gray-50"
                >
                  <h3 className="text-xl font-bold">{store.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {store.description}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{store.address}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Products</h2>

            {products.length === 0 && (
              <p className="mt-3 text-gray-600">No products found.</p>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/stores/${product.storeId}`}
                  className="rounded-xl border bg-white p-5 hover:bg-gray-50"
                >
                  {product.imageUrls[0] && (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="mb-4 h-40 w-full rounded object-cover"
                    />
                  )}

                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <div className="mt-3 font-bold">
                    {product.price.toFixed(3)} BHD
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}