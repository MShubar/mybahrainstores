export const PRODUCT_SEARCH_PLACEHOLDER_INTERVAL_MS = 5000;

export function productSearchPlaceholder(categoryName: string): string {
  return `Search for ${categoryName.toLowerCase()}`;
}
