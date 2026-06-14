import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import {
  CustomerSearchInput,
  ProductListSkeleton,
} from "../components/customer-search-input";
import { ProductCard } from "../components/product-card";

function SearchEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-card">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
        🔍
      </div>
      <p className="mt-4 text-lg font-bold text-gray-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}

export function CustomerSearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const trimmed = query.trim();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const searchResults = useQuery(
    api.products.queries.searchPublicProducts,
    trimmed ? { search: trimmed } : "skip",
  );

  const allProducts = useQuery(
    api.products.queries.listPublicProducts,
    trimmed ? "skip" : { limit: 40 },
  );

  const products = useMemo(() => {
    if (trimmed) {
      return searchResults ?? [];
    }
    return allProducts ?? [];
  }, [allProducts, searchResults, trimmed]);

  const isLoading = trimmed ? searchResults === undefined : allProducts === undefined;

  const sectionTitle = trimmed
    ? products.length === 1
      ? "1 result"
      : `${products.length} results`
    : "Browse products";

  const sectionSubtitle = trimmed
    ? `Showing matches for “${trimmed}”`
    : "Discover watches, perfume, makeup, electronics, mobile accessories, and small appliances.";

  const headerMeta = !isLoading
    ? trimmed
      ? products.length > 0
        ? `${products.length} ${products.length === 1 ? "product" : "products"} found`
        : "No matches"
      : products.length > 0
        ? `${products.length} products to explore`
        : undefined
    : undefined;

  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <div className="border-b border-gray-100 bg-white px-4 pb-5 pt-4">
        <h1 className="text-[22px] font-normal text-gray-900">Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find products across local stores in Bahrain.
        </p>
        {headerMeta ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {headerMeta}
          </p>
        ) : null}

        <div className="mt-4">
          <CustomerSearchInput value={query} onChange={setQuery} autoFocus />
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {!isLoading && products.length > 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-card">
            <h2 className="text-base font-bold text-gray-900">{sectionTitle}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{sectionSubtitle}</p>
          </div>
        ) : null}

        {isLoading ? <ProductListSkeleton count={5} /> : null}

        {!isLoading && products.length === 0 ? (
          <SearchEmptyState
            title={trimmed ? "No products found" : "Nothing to show yet"}
            description={
              trimmed
                ? "Try a different keyword or check the spelling."
                : "Products will appear here once stores add inventory."
            }
          />
        ) : null}

        {!isLoading && products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                imageUrl={product.imageUrls[0]}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
