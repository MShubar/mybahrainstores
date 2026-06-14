import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageHeader } from "../components/page-header";
import { ProductCard } from "../components/product-card";

export function CustomerProductsPage() {
  const categories = useQuery(api.categories.queries.listPublic);
  const products = useQuery(api.products.queries.listPublicProducts, { limit: 120 });
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const filtered =
    products?.filter((product) =>
      categoryId ? product.categoryId === categoryId : true,
    ) ?? [];

  if (products === undefined) {
    return <div className="p-6 text-gray-500">Loading products...</div>;
  }

  return (
    <div className="space-y-4 pb-6">
      <PageHeader title="All Products" subtitle="Browse everything in the store" />

      <div className="flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={() => setCategoryId(null)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
            !categoryId
              ? "bg-brand-primary text-white"
              : "border border-gray-200 bg-white text-gray-600"
          }`}
        >
          All
        </button>
        {categories?.map((category) => (
          <button
            key={category._id}
            type="button"
            onClick={() => setCategoryId(category._id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              categoryId === category._id
                ? "bg-brand-primary text-white"
                : "border border-gray-200 bg-white text-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto px-4">
        {["Sort", "Offers", "Rating 4.0+", "Fast Delivery"].map((filter) => (
          <span
            key={filter}
            className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
          >
            {filter}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            variant="grid"
            productId={product._id}
            name={product.name}
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            imageUrl={product.imageUrls[0]}
          />
        ))}
      </div>
    </div>
  );
}
