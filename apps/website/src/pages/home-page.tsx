import { SEO } from "../components/seo";
import { getWebAppUrl } from "../lib/web-app-url";

export function HomePage() {
    const webAppUrl = getWebAppUrl();

    return (
      <main>
        <SEO
          title="RandomStores Bahrain | Local Stores & Delivery"
          description="Discover Bahrain stores, browse products, and order from local shops online."
        />
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="text-5xl font-bold">
            Discover Bahrain Stores in One Place
          </h1>
  
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Browse local stores, explore products, place orders, and get packages
            delivered directly from stores across Bahrain.
          </p>
  
          <div className="mt-8 flex justify-center gap-3">
            <a
              href={`${webAppUrl}/signup`}
              className="rounded bg-black px-6 py-3 text-white"
            >
              Get Started
            </a>
  
            <a
              href="/stores"
              className="rounded border px-6 py-3"
            >
              Browse Stores
            </a>
          </div>
        </section>
  
        <section className="border-t bg-gray-50 px-6 py-16">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-xl font-bold">For Customers</h2>
              <p className="mt-2 text-gray-600">
                Find stores, compare products, and order easily.
              </p>
            </div>
  
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-xl font-bold">For Stores</h2>
              <p className="mt-2 text-gray-600">
                List your shop, manage products, and receive orders.
              </p>
            </div>
  
            <div className="rounded-xl border bg-white p-6">
              <h2 className="text-xl font-bold">For Bahrain</h2>
              <p className="mt-2 text-gray-600">
                A local marketplace built for fast discovery and delivery.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }