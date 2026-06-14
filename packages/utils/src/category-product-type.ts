/**
 * Product-type filters for categories that group items by accessory kind rather
 * than brand (e.g. mobile accessories). Filtering uses the stored `productType`
 * field on each product document.
 */
const CATEGORY_PRODUCT_TYPES: Record<string, readonly string[]> = {
  makeup: [
    "Face",
    "Eyes",
    "Lips",
    "Nails",
    "Eyelashes",
    "Brushes & Accessories",
    "Makeup Palettes",
    "Makeup Value Gift Sets",
  ],
};

const CIRCULAR_PRODUCT_TYPE_CATEGORIES = new Set(["makeup"]);

export function getCategoryProductTypes(slug: string | undefined | null): string[] {
  if (!slug) {
    return [];
  }

  return [...(CATEGORY_PRODUCT_TYPES[slug] ?? [])];
}

export function matchesProductType(
  product: { productType?: string | null },
  productType: string,
): boolean {
  return product.productType === productType;
}

export function categoryUsesCircularProductTypeFilters(
  slug: string | undefined | null,
): boolean {
  if (!slug) {
    return false;
  }

  return CIRCULAR_PRODUCT_TYPE_CATEGORIES.has(slug);
}

export function getProductTypeImageMapFromProducts(
  products: ReadonlyArray<{ productType?: string | null; imageUrls: string[] }>,
  orderedTypes: readonly string[],
): Record<string, string | undefined> {
  const images: Record<string, string | undefined> = {};

  for (const type of orderedTypes) {
    const product = products.find((item) => item.productType === type && item.imageUrls[0]);

    if (product?.imageUrls[0]) {
      images[type] = product.imageUrls[0];
    }
  }

  return images;
}
