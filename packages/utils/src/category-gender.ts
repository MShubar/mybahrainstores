/**
 * Gender options are a presentation concern keyed by category slug. Categories
 * that sell gendered variants (e.g. watches) expose choice buttons so shoppers
 * can narrow the list before picking a brand. Filtering relies on the product's
 * stored `gender` field; "unisex" items appear under every option.
 */
const CATEGORY_GENDERS: Record<string, readonly string[]> = {
  watches: ["Women", "Men"],
};

export function getCategoryGenders(slug: string | undefined | null): string[] {
  if (!slug) {
    return [];
  }

  return [...(CATEGORY_GENDERS[slug] ?? [])];
}

export function matchesGender(
  product: { gender?: string | null },
  gender: string,
): boolean {
  const productGender = product.gender?.toLowerCase();

  if (!productGender) {
    return false;
  }

  if (productGender === "unisex") {
    return true;
  }

  return productGender === gender.toLowerCase();
}
