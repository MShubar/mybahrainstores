import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { CategoryGrid } from "../components/category-grid";
import { CelebritiesSection } from "../components/celebrities-section";
import { CustomerHomeHeader } from "../components/customer-home-header";
import { HomeProductSearch } from "../components/home-product-search";
import { PromoBanner } from "../components/promo-banner";

export function CustomerHomePage() {
  const categories = useQuery(api.categories.queries.listPublic);
  const celebrities = useQuery(api.celebrities.queries.listPublic, { limit: 1 });

  if (categories === undefined || celebrities === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const showCelebrities = celebrities.length > 0;

  return (
    <div className="space-y-6 pb-6">
      <CustomerHomeHeader />

      <HomeProductSearch categoryNames={categories.map((category) => category.name)} />

      <div>
        <h2 className="mb-3 px-4 text-[17px] font-bold text-gray-900">Categories</h2>
        <CategoryGrid categories={categories} limit={8} />
      </div>

      {showCelebrities ? <CelebritiesSection /> : null}
      {!showCelebrities ? <PromoBanner /> : null}
    </div>
  );
}
