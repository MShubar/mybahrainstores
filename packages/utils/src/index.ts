export function formatCurrency(amount: number, currency: string, locale = "en-BH"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}
