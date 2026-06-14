export function formatPrice(amount: number, currency = "BD"): string {
  return `${currency} ${amount.toFixed(3)}`;
}

export function discountPercent(
  price: number,
  compareAtPrice?: number,
): number | null {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
