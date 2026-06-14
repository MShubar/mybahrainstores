/** Studio brand-tile images for the watches category (served from web-app /public). */
export const WATCH_BRAND_TILE_IMAGES: Readonly<Record<string, string>> = {
  Casio: "/brands/watches/casio.png",
  Seiko: "/brands/watches/seiko.png",
  "G-Shock": "/brands/watches/g-shock.png",
  "Calvin Klein": "/brands/watches/calvin-klein.png",
  Lacoste: "/brands/watches/lacoste.png",
  "Tommy Hilfiger": "/brands/watches/tommy-hilfiger.png",
  "Armani Exchange": "/brands/watches/armani-exchange.png",
  Tissot: "/brands/watches/tissot.png",
  "Apple Watch": "/brands/watches/apple-watch.png",
};

export function mergeCategoryBrandTileImages(
  categorySlug: string | undefined | null,
  fromProducts: Record<string, string | undefined>,
): Record<string, string | undefined> {
  if (categorySlug !== "watches") {
    return fromProducts;
  }

  return {
    ...fromProducts,
    ...WATCH_BRAND_TILE_IMAGES,
  };
}
