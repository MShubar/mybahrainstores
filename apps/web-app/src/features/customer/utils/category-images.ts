const CATEGORY_IMAGE_SLUGS = [
  "watches",
  "perfume",
  "makeup",
  "electronics",
  "accessories",
  "small-appliances",
] as const;

export type CategoryImageSlug = (typeof CATEGORY_IMAGE_SLUGS)[number];

export function getCategoryImageUrl(slug: string): string {
  if (CATEGORY_IMAGE_SLUGS.includes(slug as CategoryImageSlug)) {
    return `/categories/${slug}.jpg`;
  }

  return "/categories/accessories.jpg";
}
