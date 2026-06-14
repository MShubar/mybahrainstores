import type { ReactNode } from "react";

type BrandFilterRowProps = {
  brands: string[];
  brandImages: Record<string, string | undefined>;
  selectedBrand: string | null;
  onSelect: (brand: string | null) => void;
  showAll?: boolean;
  layout?: "scroll" | "grid";
  /**
   * When true, each brand image already contains the grey circle + product
   * pop-out composition (rendered full-bleed). When false, the product photo is
   * shown inside a CSS grey circle.
   */
  bakedTiles?: boolean;
};

const AVATAR_SIZE = 88;
const GRID_AVATAR_SIZE = 72;

function BrandCircle({ children, size = AVATAR_SIZE }: { children: ReactNode; size?: number }) {
  return (
    <div
      className="overflow-hidden rounded-full bg-[#ECECEC]"
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

/** Tile whose image already bakes in the grey circle + product pop-out. */
function BakedTile({
  src,
  size,
  selected,
  fallback,
}: {
  src?: string;
  size: number;
  selected: boolean;
  fallback: ReactNode;
}) {
  // The baked images include white padding around the grey circle, so scale the
  // image up to make the visible circle fill the tile. The overflowing white
  // padding is invisible against the white page background.
  const IMAGE_SCALE = 1.5;

  return (
    <div
      className="relative flex items-center justify-center overflow-visible"
      style={{ width: size, height: size }}
    >
      {selected ? (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-[#FF5A00]"
          style={{
            width: size * 0.96,
            height: size * 0.96,
          }}
        />
      ) : null}

      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain"
          style={{ transform: `scale(${IMAGE_SCALE})` }}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#ECECEC] text-lg font-bold text-gray-400">
          {fallback}
        </div>
      )}
    </div>
  );
}

function AllBrandsTile({
  brands,
  brandImages,
  size = AVATAR_SIZE,
}: {
  brands: string[];
  brandImages: Record<string, string | undefined>;
  size?: number;
}) {
  const previewBrands = brands.slice(0, 4);
  const cells = Array.from({ length: 4 }, (_, index) => previewBrands[index] ?? null);

  return (
    <BrandCircle size={size}>
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-px bg-[#E0E0E0]">
        {cells.map((brand, index) => {
          const imageUrl = brand ? brandImages[brand] : undefined;

          return (
            <div key={brand ?? `all-slot-${index}`} className="overflow-hidden bg-[#ECECEC]">
              {brand && imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full scale-125 object-cover object-center"
                  loading="lazy"
                />
              ) : brand ? (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400">
                  {brand.charAt(0)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </BrandCircle>
  );
}

function BrandAvatar({
  brand,
  imageUrl,
  selected,
  onClick,
  compact = false,
  bakedTiles = false,
}: {
  brand: string;
  imageUrl?: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
  bakedTiles?: boolean;
}) {
  const avatarSize = compact ? GRID_AVATAR_SIZE : AVATAR_SIZE;
  const widthClass = compact
    ? "w-full min-w-0"
    : bakedTiles
      ? "w-[112px] flex-shrink-0"
      : "w-[96px] flex-shrink-0";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 ${widthClass}`}
    >
      {bakedTiles ? (
        <BakedTile
          src={imageUrl}
          size={avatarSize}
          selected={selected}
          fallback={brand.charAt(0)}
        />
      ) : (
        <div
          className={`rounded-full p-[3px] transition ${
            selected ? "bg-[#FF5A00] shadow-sm" : "bg-transparent"
          }`}
        >
          <BrandCircle size={avatarSize}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full scale-[1.08] object-cover object-center"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-400">
                {brand.charAt(0)}
              </div>
            )}
          </BrandCircle>
        </div>
      )}

      <span
        className={`line-clamp-2 min-h-[2rem] w-full text-center text-[11px] font-semibold leading-tight ${
          selected ? "text-[#FF5A00]" : "text-gray-900"
        }`}
      >
        {brand}
      </span>
    </button>
  );
}

export function BrandFilterRow({
  brands,
  brandImages,
  selectedBrand,
  onSelect,
  showAll = true,
  layout = "scroll",
  bakedTiles = false,
}: BrandFilterRowProps) {
  if (brands.length === 0) {
    return null;
  }

  if (!showAll && brands.length === 1) {
    return null;
  }

  const isGrid = layout === "grid";
  const baseSize = isGrid ? GRID_AVATAR_SIZE : AVATAR_SIZE;

  return (
    <div className="border-b border-gray-100 bg-white py-4">
      <div
        className={
          isGrid
            ? "grid grid-cols-4 gap-x-2 gap-y-4 px-4"
            : "flex gap-3 overflow-x-auto px-4 pb-0.5 scrollbar-hide"
        }
      >
        {showAll ? (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={`flex flex-col items-center gap-2 ${
              isGrid ? "w-full min-w-0" : "w-[96px] flex-shrink-0"
            }`}
          >
            <div
              className={`rounded-full p-[3px] transition ${
                selectedBrand === null ? "bg-[#FF5A00] shadow-sm" : "bg-transparent"
              }`}
            >
              <AllBrandsTile brands={brands} brandImages={brandImages} size={baseSize} />
            </div>
            <span
              className={`text-center text-[11px] font-semibold ${
                selectedBrand === null ? "text-[#FF5A00]" : "text-gray-900"
              }`}
            >
              All
            </span>
          </button>
        ) : null}

        {brands.map((brand) => (
          <BrandAvatar
            key={brand}
            brand={brand}
            imageUrl={brandImages[brand]}
            selected={selectedBrand === brand}
            onClick={() => onSelect(brand)}
            compact={isGrid}
            bakedTiles={bakedTiles}
          />
        ))}
      </div>
    </div>
  );
}

export const BrandFilterChips = BrandFilterRow;
