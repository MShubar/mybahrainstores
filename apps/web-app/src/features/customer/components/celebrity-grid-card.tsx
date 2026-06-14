import { Link } from "react-router-dom";

type CelebrityGridCardProps = {
  slug: string;
  name: string;
  avatarUrl?: string;
};

export function CelebrityGridCard({
  slug,
  name,
  avatarUrl,
}: CelebrityGridCardProps) {
  return (
    <Link
      to={`/customer/celebrities/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition hover:border-orange-100 hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F3F4F6]">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-surface text-3xl font-bold text-brand-primary">
            {name.charAt(0)}
          </div>
        )}
      </div>

      <p className="line-clamp-2 px-2 py-2 text-center text-xs font-bold leading-snug text-gray-900">
        {name}
      </p>
    </Link>
  );
}

export function CelebrityGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card"
        >
          <div className="aspect-square w-full bg-gray-100" />
          <div className="mx-auto my-2 h-3 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
