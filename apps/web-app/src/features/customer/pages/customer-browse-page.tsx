import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { CategoryGrid, CategoryGridSkeleton } from "../components/category-grid";
import { CustomerSearchInput } from "../components/customer-search-input";

export function CustomerBrowsePage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const searchResults = useQuery(
    api.categories.queries.searchPublic,
    trimmed ? { search: trimmed } : "skip",
  );

  const allCategories = useQuery(
    api.categories.queries.listPublic,
    trimmed ? "skip" : {},
  );

  const categories = useMemo(() => {
    if (trimmed) {
      return searchResults ?? [];
    }
    return allCategories ?? [];
  }, [allCategories, searchResults, trimmed]);

  const isLoading = trimmed ? searchResults === undefined : allCategories === undefined;

  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <div className="border-b border-gray-100 bg-white px-4 pb-4 pt-4">
        <h1 className="text-center text-[22px] font-normal text-gray-900">Categories</h1>
        <div className="mt-4">
          <CustomerSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search categories…"
          />
        </div>
      </div>

      <div className="px-4 pt-4">
        {isLoading ? (
          <CategoryGridSkeleton variant="cards" />
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
              {trimmed ? "🔍" : "🏷️"}
            </div>
            <p className="mt-4 text-lg font-bold text-gray-900">
              {trimmed ? "No matches found" : "No categories yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {trimmed
                ? `Try a different name for “${trimmed}”.`
                : "Categories will appear here once they are added to the platform."}
            </p>
          </div>
        ) : (
          <CategoryGrid categories={categories} variant="cards" />
        )}
      </div>
    </div>
  );
}
