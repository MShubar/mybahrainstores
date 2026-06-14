import { getCategoryImageUrl } from "../utils/category-images";

type CategoryImageTileProps = {
  slug: string;
  name: string;
  size?: "compact" | "card";
};

export function CategoryImageTile({ slug, name, size = "compact" }: CategoryImageTileProps) {
  const isCard = size === "card";

  return (
    <div
      className={`overflow-hidden bg-[#FFF8F0] ${
        isCard ? "aspect-square w-full" : "aspect-square w-full rounded-2xl"
      }`}
    >
      <img
        src={getCategoryImageUrl(slug)}
        alt=""
        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
        loading="lazy"
      />
      <span className="sr-only">{name}</span>
    </div>
  );
}
