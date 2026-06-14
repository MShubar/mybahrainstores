import { Link } from "react-router-dom";

const BANNER_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&auto=format&fit=crop",
    alt: "Perfume",
    className: "h-16 w-16 rotate-[-8deg]",
  },
  {
    src: "https://images.unsplash.com/photo-1572635196233-1594f4753b45?w=200&auto=format&fit=crop",
    alt: "Sunglasses",
    className: "h-14 w-14 rotate-[6deg] -ml-3 mt-4",
  },
];

export function CelebritiesPicksBanner() {
  return (
    <div className="relative mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF8C42] via-[#FF5A00] to-[#E65100] p-5 shadow-celebrity">
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 left-1/3 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85">
            Celebrities&apos; Picks
          </p>
          <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-white">
            Handpicked favorites just for you!
          </h3>
          <Link
            to="/customer/celebrities"
            className="mt-4 inline-flex items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#FF5A00] shadow-sm transition hover:bg-orange-50 active:scale-[0.98]"
          >
            Shop Now
          </Link>
        </div>

        <div className="flex flex-shrink-0 items-end pr-1">
          {BANNER_IMAGES.map((image) => (
            <img
              key={image.alt}
              src={image.src}
              alt={image.alt}
              className={`rounded-xl border-2 border-white/30 object-cover shadow-md ${image.className}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
