import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { SEO } from "../components/seo";

export function CategoriesPage() {
  const categories = useQuery(api.categories.queries.listPublic);

  if (categories === undefined) {
    return <main className="mx-auto max-w-6xl px-6 py-12">Loading...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <SEO
        title="Shop by Category | RandomStores Bahrain"
        description="Browse store categories across Bahrain and find local shops by type."
      />
      <h1 className="text-4xl font-bold">Categories</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category._id}`}
            className="rounded-xl border bg-white p-5 hover:bg-gray-50"
          >
            <h2 className="text-xl font-bold">{category.name}</h2>
            <p className="mt-2 text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}