import { Link } from "react-router-dom";

type CelebrityAvatarCardProps = {
  slug: string;
  name: string;
  avatarUrl?: string;
};

export function CelebrityAvatarCard({ slug, name, avatarUrl }: CelebrityAvatarCardProps) {
  return (
    <Link
      to={`/customer/celebrities/${slug}`}
      className="group flex w-[76px] flex-shrink-0 snap-start flex-col items-center gap-2.5 transition-transform active:scale-95"
    >
      <div className="rounded-full bg-gradient-to-br from-[#F5D76E] via-brand-gold to-[#B8860B] p-[2.5px] shadow-sm transition group-hover:shadow-celebrity">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-[68px] w-[68px] rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-white bg-brand-surface text-xl font-bold text-brand-primary">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <span className="line-clamp-2 w-full text-center text-[11px] font-semibold leading-tight text-gray-900">
        {name}
      </span>
    </Link>
  );
}
