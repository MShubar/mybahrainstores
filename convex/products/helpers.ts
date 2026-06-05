export { now, withTimestamps, withUpdatedAt } from "../shared/helpers";

export function isPublicProduct(product: {
  isActive: boolean;
  isAvailable: boolean;
}): boolean {
  return product.isActive && product.isAvailable;
}
