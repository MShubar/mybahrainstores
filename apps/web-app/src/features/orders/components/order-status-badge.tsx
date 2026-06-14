type OrderStatusTone = "pending" | "success" | "danger";

type OrderStatusBadgeProps = {
  label: string;
  tone: OrderStatusTone;
};

const toneStyles: Record<OrderStatusTone, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-100",
  success: "bg-green-50 text-green-700 ring-green-100",
  danger: "bg-red-50 text-red-700 ring-red-100",
};

export function OrderStatusBadge({ label, tone }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}

export function orderStatusTone({
  isCancelled,
  isDelivered,
}: {
  isCancelled: boolean;
  isDelivered: boolean;
}): OrderStatusTone {
  if (isCancelled) {
    return "danger";
  }
  if (isDelivered) {
    return "success";
  }
  return "pending";
}

export function paymentStatusTone({
  isPaid,
  isPaymentFailed,
}: {
  isPaid: boolean;
  isPaymentFailed?: boolean;
}): OrderStatusTone {
  if (isPaymentFailed) {
    return "danger";
  }
  if (isPaid) {
    return "success";
  }
  return "pending";
}
