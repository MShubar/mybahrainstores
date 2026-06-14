import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { PageHeader } from "../components/page-header";
import { ProductCard } from "../components/product-card";
import { VerifiedBadge } from "../components/verified-badge";

export function CelebrityDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState<Id<"categories"> | undefined>();

  const data = useQuery(api.celebrities.queries.listPicks, {
    slug,
    categoryId,
  });

  if (data === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!data.celebrity) {
    return (
      <div className="space-y-4 pb-6">
        <PageHeader title="Celebrity" onBack={() => navigate(-1)} />
        <div className="space-y-4 px-4 py-8 text-center">
          <p className="text-gray-600">Celebrity not found.</p>
          <Link to="/customer" className="font-semibold text-[#FF5A00]">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { celebrity, categories, picks } = data;

  return (
    <div className="pb-6">
      <PageHeader title={celebrity.name} variant="primary" />

      <div className="flex gap-4 border-b border-gray-100 bg-white p-4 shadow-card">
        {celebrity.avatarUrl ? (
          <img
            src={celebrity.avatarUrl}
            alt={celebrity.name}
            className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover ring-2 ring-brand-gold/30"
          />
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-surface text-3xl font-bold text-[#FF5A00]">
            {celebrity.name.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{celebrity.name}</h2>
            {celebrity.isVerified ? <VerifiedBadge /> : null}
          </div>
          {celebrity.title ? (
            <p className="mt-0.5 text-sm font-medium text-gray-600">{celebrity.title}</p>
          ) : null}
          {celebrity.bio ? (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{celebrity.bio}</p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        <button
          type="button"
          onClick={() => setCategoryId(undefined)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            !categoryId
              ? "bg-[#FF5A00] text-white shadow-sm"
              : "bg-brand-surface text-gray-700 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => setCategoryId(category._id as Id<"categories">)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              categoryId === category._id
                ? "bg-[#FF5A00] text-white shadow-sm"
                : "bg-brand-surface text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4">
        {picks.length === 0 ? (
          <p className="py-8 text-center text-gray-500">No picks in this category yet.</p>
        ) : (
          picks.map(({ product }) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              imageUrl={product.imageUrls[0]}
            />
          ))
        )}
      </div>

      {picks.length > 0 ? (
        <div className="px-4 pt-4">
          <Link
            to="/customer/products"
            className="block rounded-2xl bg-[#FF5A00] py-3.5 text-center text-base font-bold text-white shadow-celebrity transition hover:bg-[#E65100] active:scale-[0.99]"
          >
            View More Picks
          </Link>
        </div>
      ) : null}
    </div>
  );
}
