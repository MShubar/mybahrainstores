import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { CelebrityGridCard } from "./celebrity-grid-card";

const HOME_PREVIEW_LIMIT = 3;

export function CelebritiesSection() {
  const celebrities = useQuery(api.celebrities.queries.listPublic, { limit: 12 });

  if (celebrities === undefined || celebrities.length === 0) {
    return null;
  }

  const preview = celebrities.slice(0, HOME_PREVIEW_LIMIT);

  return (
    <section className="space-y-4 pt-1">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-[17px] font-bold uppercase tracking-[0.06em] text-gray-900">
          Celebrities
        </h2>
        <Link
          to="/customer/celebrities"
          className="text-sm font-bold text-gray-900 underline-offset-2 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4">
        {preview.map((celebrity) => (
          <CelebrityGridCard
            key={celebrity._id}
            slug={celebrity.slug}
            name={celebrity.name}
            avatarUrl={celebrity.avatarUrl}
          />
        ))}
      </div>
    </section>
  );
}
