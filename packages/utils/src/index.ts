export function formatCurrency(amount: number, currency: string, locale = "en-BH"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export {
  CATEGORY_BRAND_TILE_IMAGES,
  getCategoryBrandImageMap,
  getCategoryBrands,
  mergeCategoryBrandTileImages,
  WATCH_BRAND_TILE_IMAGES,
} from "./category-brand-tile-images";
export {
  collectBrandsFromProductNames,
  collectCategoryBrands,
  extractBrandFromProductName,
  getBrandImageMapFromProducts,
} from "./product-brand";
export { getCategoryGenders, matchesGender } from "./category-gender";
export {
  PRODUCT_SEARCH_PLACEHOLDER_INTERVAL_MS,
  productSearchPlaceholder,
} from "./product-search-placeholder";
export {
  categoryUsesCircularProductTypeFilters,
  getCategoryProductTypes,
  getProductTypeImageMapFromProducts,
  matchesProductType,
} from "./category-product-type";
export {
  featureBullets,
  mockRating,
  productDetailHighlights,
  productDetailSpecs,
  type ProductSpec,
} from "./product-detail";
