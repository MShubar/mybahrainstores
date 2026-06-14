type OrderItem = {
  name: string;
  quantity: number;
};

export function summarizeOrderItems(items: OrderItem[]): string {
  if (items.length === 0) {
    return "Order";
  }

  const first = items[0]!;
  if (items.length === 1) {
    return first.quantity > 1 ? `${first.name} × ${first.quantity}` : first.name;
  }

  const extraCount = items.length - 1;
  return `${first.name} + ${extraCount} more`;
}
