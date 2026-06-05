export const ORDER_STATUS_STEPS = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];
  
  export function getOrderStatusIndex(status: string) {
    return ORDER_STATUS_STEPS.indexOf(status);
  }