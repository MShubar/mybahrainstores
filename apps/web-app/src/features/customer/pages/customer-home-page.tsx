import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function CustomerHomePage() {
  const categories = useQuery(api.categories.queries.listPublic);

  if (categories === undefined) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Categories</h1>
        <p className="mt-1 text-gray-600">
          Choose a category to find stores in Bahrain.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/customer/categories/${category._id}`}
            className="rounded-xl border bg-white p-5 shadow-sm hover:bg-gray-50"
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <p className="mt-1 text-sm text-gray-600">
              {category.description || "View stores"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}