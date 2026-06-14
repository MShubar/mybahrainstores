/** Circular filter tile images per category (served from web-app /public/brands). */
export const CATEGORY_BRAND_TILE_IMAGES: Readonly<
  Record<string, Readonly<Record<string, string>>>
> = {
  watches: {
    Casio: "/brands/watches/casio.png",
    Seiko: "/brands/watches/seiko.png",
    "G-Shock": "/brands/watches/g-shock.png",
    "Calvin Klein": "/brands/watches/calvin-klein.png",
    Lacoste: "/brands/watches/lacoste.png",
    "Tommy Hilfiger": "/brands/watches/tommy-hilfiger.png",
    "Armani Exchange": "/brands/watches/armani-exchange.png",
    Tissot: "/brands/watches/tissot.png",
    "Apple Watch": "/brands/watches/apple-watch.png",
  },
  accessories: {
    Anker: "/brands/accessories/anker.png",
    Apple: "/brands/accessories/apple.png",
    Samsung: "/brands/accessories/samsung.png",
    Belkin: "/brands/accessories/belkin.png",
    Baseus: "/brands/accessories/baseus.png",
    Spigen: "/brands/accessories/spigen.png",
  },
  perfume: {
    Chanel: "/brands/perfume/chanel.png",
    Dior: "/brands/perfume/dior.png",
    "Tom Ford": "/brands/perfume/tom-ford.png",
    YSL: "/brands/perfume/ysl.png",
    Oud: "/brands/perfume/oud.png",
    Fresh: "/brands/perfume/fresh.png",
  },
  makeup: {
    Face: "/brands/makeup/face.png",
    Eyes: "/brands/makeup/eyes.png",
    Lips: "/brands/makeup/lips.png",
    Nails: "/brands/makeup/nails.png",
    Eyelashes: "/brands/makeup/eyelashes.png",
    "Brushes & Accessories": "/brands/makeup/brushes-accessories.png",
    "Makeup Palettes": "/brands/makeup/makeup-palettes.png",
    "Makeup Value Gift Sets": "/brands/makeup/makeup-gift-sets.png",
  },
};

export function getCategoryBrandImageMap(
  slug: string | undefined | null,
): Record<string, string | undefined> {
  if (!slug) {
    return {};
  }

  return { ...(CATEGORY_BRAND_TILE_IMAGES[slug] ?? {}) };
}

/** Static brand/type tiles override product-derived fallbacks. */
export function mergeCategoryBrandTileImages(
  categorySlug: string | undefined | null,
  fromProducts: Record<string, string | undefined>,
): Record<string, string | undefined> {
  return {
    ...fromProducts,
    ...getCategoryBrandImageMap(categorySlug),
  };
}

export function getCategoryBrands(slug: string | undefined | null): string[] {
  if (!slug) {
    return [];
  }

  const tiles = CATEGORY_BRAND_TILE_IMAGES[slug];

  if (!tiles) {
    return [];
  }

  return Object.keys(tiles).sort((a, b) => a.localeCompare(b));
}

/** @deprecated Use CATEGORY_BRAND_TILE_IMAGES.watches */
export const WATCH_BRAND_TILE_IMAGES = CATEGORY_BRAND_TILE_IMAGES.watches;
