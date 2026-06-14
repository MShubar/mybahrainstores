export const DEMO_STORE_OWNER_EMAIL = "demo@randomstores.com";
export const DEMO_CUSTOMER_EMAIL = "demo-customer@randomstores.com";
export const DEMO_PASSWORD = "Demo123!";

export const DEMO_STORE_NAME = "Demo Electronics";
export const DEMO_STORE_SLUG = "demo-electronics";
export const DEMO_OWNER_NAME = "Demo Account";
export const DEMO_CUSTOMER_NAME = "Demo Customer";

export const DEMO_TARGET_REVENUE = 2450;
export const DEMO_TARGET_ORDER_COUNT = 143;
export const DEMO_TARGET_COMMISSION = 245;
export const DEMO_TARGET_NET_EARNINGS = 2205;

export function isDemoAccountEmail(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return (
    normalized === DEMO_STORE_OWNER_EMAIL ||
    normalized === DEMO_CUSTOMER_EMAIL
  );
}
