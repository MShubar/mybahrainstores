import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SEO } from "../components/seo";

export function StoresPage() {
  const stores = useQuery(api.stores.queries.listPublicStores);

  if (stores === undefined) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SEO
        title="Browse Stores in Bahrain | RandomStores"
        description="Explore approved local stores in Bahrain and discover products available for delivery."
      />
      <h1 className="text-4xl font-bold">Stores</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
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

            <h2 className="text-xl font-bold">{store.name}</h2>
            <p className="mt-2 text-gray-600">{store.description}</p>
            <p className="mt-2 text-sm text-gray-500">{store.address}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}