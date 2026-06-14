import { Link } from "react-router-dom";
import { CategoryImageTile } from "./category-image-tile";

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
};

type CategoryGridProps = {
  categories: Category[];
  variant?: "compact" | "cards";
  limit?: number;
};

function CompactCategoryItem({ category }: { category: Category }) {
  return (
    <Link
      to={`/customer/categories/${category._id}`}
      className="group flex flex-col items-center gap-1 text-center"
    >
      <div className="w-full transition group-active:scale-95">
        <CategoryImageTile slug={category.slug} name={category.name} />
      </div>
      <span className="line-clamp-2 min-h-[2rem] text-xs font-bold leading-tight text-gray-900">
        {category.name}
      </span>
    </Link>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/customer/categories/${category._id}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition hover:border-orange-100 hover:shadow-md active:scale-[0.99]"
    >
      <CategoryImageTile slug={category.slug} name={category.name} size="card" />
      <p className="line-clamp-2 min-h-[2.25rem] px-1 py-1.5 text-center text-[10px] font-bold leading-tight text-gray-900">
        {category.name}
      </p>
    </Link>
  );
}

export function CategoryGridSkeleton({ variant = "cards" }: { variant?: "compact" | "cards" }) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap justify-start gap-x-1 gap-y-2 px-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex w-[calc(25%-3px)] animate-pulse flex-col items-center gap-1">
            <div className="aspect-square w-full rounded-2xl bg-[#FFF0E6]" />
            <div className="h-3 w-12 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card"
        >
          <div className="aspect-square w-full bg-[#FFF0E6]" />
          <div className="mx-auto my-2 h-3 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function CategoryGrid({ categories, variant = "compact", limit }: CategoryGridProps) {
  const visibleCategories = limit !== undefined ? categories.slice(0, limit) : categories;

  if (variant === "cards") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {visibleCategories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-start gap-x-1 gap-y-2 px-4">
      {visibleCategories.map((category) => (
        <div key={category._id} className="w-[calc(25%-3px)]">
          <CompactCategoryItem category={category} />
        </div>
      ))}
    </div>
  );
}
