/**
 * Representative product used as the brand filter tile image (product photo, not a logo).
 * Longest brand names must stay in KNOWN_MULTI_WORD_BRANDS below.
 */
import { getCategoryBrands } from "./category-brand-tile-images";
const BRAND_TILE_HERO_PRODUCTS: Readonly<Record<string, string>> = {
  Anker: "Anker Power Bank 10000mAh",
  Apple: "Apple MagSafe Phone Case",
  Samsung: "Samsung Wireless Earbuds",
  Belkin: "Belkin Car Vent Phone Mount",
  Baseus: "Baseus Magnetic Power Bank",
  Spigen: "Spigen Ultra Hybrid Case",
  Casio: "Casio MTP-V002D",
  Seiko: "Seiko 5 Sports SRPD55",
  "G-Shock": "G-Shock GA-2100-1A1",
  "Calvin Klein": "Calvin Klein Minimal K2G21626",
  Lacoste: "Lacoste 12.12 Blue",
  "Tommy Hilfiger": "Tommy Hilfiger 1791060",
  "Armani Exchange": "Armani Exchange AX2103",
  Tissot: "Tissot PRX Powermatic 80",
  "Apple Watch": "Apple Watch Series 9 GPS 41mm",
  Chanel: "Chanel No. 5 Eau de Parfum",
  Dior: "Dior Sauvage EDT",
  "Tom Ford": "Tom Ford Black Orchid",
  YSL: "YSL Libre EDP",
  Oud: "Oud Wood Gift Set",
  Fresh: "Fresh Citrus Body Mist",
};

/** Longest-first so multi-word brands match before single-word prefixes. */
const KNOWN_MULTI_WORD_BRANDS = [
  "Tommy Hilfiger",
  "Armani Exchange",
  "Apple Watch",
  "Calvin Klein",
  "G-Shock",
  "Tom Ford",
] as const;

export function extractBrandFromProductName(name: string): string {
  const normalized = name.trim();
  if (!normalized) {
    return "Other";
  }

  for (const brand of KNOWN_MULTI_WORD_BRANDS) {
    if (normalized === brand || normalized.startsWith(`${brand} `)) {
      return brand;
    }
  }

  return normalized.split(/\s+/)[0] ?? normalized;
}

export function collectBrandsFromProductNames(names: string[]): string[] {
  const brands = new Set<string>();

  for (const name of names) {
    brands.add(extractBrandFromProductName(name));
  }

  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

export function collectCategoryBrands(
  categorySlug: string | undefined | null,
  productNames: readonly string[],
): string[] {
  const brands = new Set<string>(getCategoryBrands(categorySlug));

  for (const name of productNames) {
    brands.add(extractBrandFromProductName(name));
  }

  return Array.from(brands).sort((a, b) => a.localeCompare(b));
}

export function getBrandImageMapFromProducts(
  products: ReadonlyArray<{ name: string; imageUrl?: string }>,
): Record<string, string | undefined> {
  const images: Record<string, string | undefined> = {};

  for (const product of products) {
    const brand = extractBrandFromProductName(product.name);
    const heroName = BRAND_TILE_HERO_PRODUCTS[brand];

    if (heroName !== product.name || !product.imageUrl) {
      continue;
    }

    images[brand] = product.imageUrl;
  }

  for (const product of products) {
    const brand = extractBrandFromProductName(product.name);

    if (!images[brand] && product.imageUrl) {
      images[brand] = product.imageUrl;
    }
  }

  return images;
}
