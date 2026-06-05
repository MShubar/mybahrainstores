import { getSettingValue } from "../settings/helpers";
import type { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";

export type TrackingStepState =
  | "complete"
  | "current"
  | "upcoming"
  | "failed"
  | "cancelled";

export type TrackingStep = {
  key: string;
  label: string;
  state: TrackingStepState;
};

export function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapStepStates(
  statuses: string[],
  currentStatus: string,
  options?: { lockedUntilIndex?: number },
): TrackingStep[] {
  const currentIndex = statuses.indexOf(currentStatus);

  return statuses.map((key, index) => {
    if (options?.lockedUntilIndex !== undefined && index > options.lockedUntilIndex) {
      return { key, label: formatStatusLabel(key), state: "upcoming" };
    }

    if (currentIndex === -1) {
      return {
        key,
        label: formatStatusLabel(key),
        state: index === 0 ? "current" : "upcoming",
      };
    }

    if (index < currentIndex) {
      return { key, label: formatStatusLabel(key), state: "complete" };
    }

    if (index === currentIndex) {
      return { key, label: formatStatusLabel(key), state: "current" };
    }

    return { key, label: formatStatusLabel(key), state: "upcoming" };
  });
}

export async function buildCustomerOrderTracking(
  ctx: QueryCtx,
  order: Doc<"orders">,
) {
  const orderStatuses = await getSettingValue<string[]>(ctx, "order_statuses", [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]);

  const paymentStatuses = await getSettingValue<string[]>(ctx, "payment_statuses", [
    "pending",
    "paid",
    "failed",
    "refunded",
  ]);

  const pendingPaymentStatus = await getSettingValue<string>(
    ctx,
    "default_payment_status",
    "pending",
  );

  const paidPaymentStatus =
    paymentStatuses.find((status) => status === "paid") ?? "paid";

  const cancelledStatus =
    orderStatuses.find((status) => status === "cancelled") ?? "cancelled";

  const deliveredStatus =
    orderStatuses.find((status) => status === "delivered") ?? "delivered";

  const failedPaymentStatus =
    paymentStatuses.find((status) => status === "failed") ?? "failed";

  const isCancelled = order.orderStatus === cancelledStatus;
  const isDelivered = order.orderStatus === deliveredStatus;
  const isPaid = order.paymentStatus === paidPaymentStatus;
  const isPaymentFailed = order.paymentStatus === failedPaymentStatus;

  const fulfilmentStatuses = orderStatuses.filter(
    (status) => status !== cancelledStatus,
  );

  const paymentSteps: TrackingStep[] = paymentStatuses.map((key) => {
    if (key === order.paymentStatus) {
      if (isPaymentFailed) {
        return { key, label: formatStatusLabel(key), state: "failed" };
      }
      return { key, label: formatStatusLabel(key), state: "current" };
    }

    const currentIndex = paymentStatuses.indexOf(order.paymentStatus);
    const stepIndex = paymentStatuses.indexOf(key);

    if (currentIndex === -1) {
      return { key, label: formatStatusLabel(key), state: "upcoming" };
    }

    if (stepIndex < currentIndex) {
      return { key, label: formatStatusLabel(key), state: "complete" };
    }

    return { key, label: formatStatusLabel(key), state: "upcoming" };
  });

  let orderSteps: TrackingStep[];

  if (isCancelled) {
    orderSteps = [
      {
        key: cancelledStatus,
        label: formatStatusLabel(cancelledStatus),
        state: "cancelled",
      },
    ];
  } else if (!isPaid) {
    const pendingOrderStatus =
      fulfilmentStatuses.find((status) => status === "pending") ??
      fulfilmentStatuses[0] ??
      "pending";
    const lockedIndex = fulfilmentStatuses.indexOf(pendingOrderStatus);
    orderSteps = mapStepStates(fulfilmentStatuses, order.orderStatus, {
      lockedUntilIndex: lockedIndex >= 0 ? lockedIndex : 0,
    }).map((step) =>
      fulfilmentStatuses.indexOf(step.key) > lockedIndex
        ? { ...step, state: "upcoming" as const }
        : step,
    );
  } else {
    orderSteps = mapStepStates(fulfilmentStatuses, order.orderStatus);
  }

  const completedOrderSteps = orderSteps.filter(
    (step) => step.state === "complete",
  ).length;

  const progressPercent =
    orderSteps.length === 0
      ? 0
      : Math.round((completedOrderSteps / orderSteps.length) * 100);

  return {
    paymentSteps,
    orderSteps,
    isCancelled,
    isDelivered,
    isPaid,
    isPaymentFailed,
    pendingPaymentStatus,
    paidPaymentStatus,
    progressPercent,
    currentStatusLabel: formatStatusLabel(order.orderStatus),
    currentPaymentLabel: formatStatusLabel(order.paymentStatus),
  };
}
