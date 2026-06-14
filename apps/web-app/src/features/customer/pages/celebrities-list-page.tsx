import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { CelebrityGridCard, CelebrityGridSkeleton } from "../components/celebrity-grid-card";
import { CustomerSearchInput } from "../components/customer-search-input";
import { PageHeader } from "../components/page-header";

export function CelebritiesListPage() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const searchResults = useQuery(
    api.celebrities.queries.searchPublic,
    trimmed ? { search: trimmed } : "skip",
  );

  const allCelebrities = useQuery(
    api.celebrities.queries.listPublic,
    trimmed ? "skip" : {},
  );

  const celebrities = useMemo(() => {
    if (trimmed) {
      return searchResults ?? [];
    }
    return allCelebrities ?? [];
  }, [allCelebrities, searchResults, trimmed]);

  const isLoading = trimmed ? searchResults === undefined : allCelebrities === undefined;

  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <PageHeader title="Celebrities" showBack={false} />

      <div className="border-b border-gray-100 bg-white px-4 pb-4">
        <CustomerSearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search celebrities…"
        />
      </div>

      <div className="px-4 pt-4">
        {isLoading ? (
          <CelebrityGridSkeleton />
        ) : celebrities.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl">
              {trimmed ? "🔍" : "⭐"}
            </div>
            <p className="mt-4 text-lg font-bold text-gray-900">
              {trimmed ? "No matches found" : "No celebrities yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {trimmed
                ? `Try a different name for “${trimmed}”.`
                : "Creator picks will appear here once they are added to the platform."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {celebrities.map((celebrity) => (
              <CelebrityGridCard
                key={celebrity._id}
                slug={celebrity.slug}
                name={celebrity.name}
                avatarUrl={celebrity.avatarUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
