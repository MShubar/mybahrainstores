import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";

type Ctx = QueryCtx | MutationCtx;

export function normalizeIban(iban: string): string {
  return iban.replace(/\s/g, "").toUpperCase();
}

export function assertValidBahrainIban(iban: string): void {
  const normalized = normalizeIban(iban);

  if (!/^BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}$/.test(normalized)) {
    throw new ConvexError("Enter a valid Bahrain IBAN (22 characters, starts with BH)");
  }
}

export async function getPayoutInfoStatuses(ctx: Ctx): Promise<string[]> {
  return await getSettingValue<string[]>(ctx, "payout_info_statuses", [
    "not_submitted",
    "pending",
    "approved",
    "rejected",
  ]);
}

export async function assertValidPayoutInfoStatus(
  ctx: Ctx,
  status: string,
): Promise<void> {
  const allowed = await getPayoutInfoStatuses(ctx);
  if (!allowed.includes(status)) {
    throw new ConvexError(`Invalid payout info status: ${status}`);
  }
}

export async function getDefaultPayoutInfoStatus(ctx: Ctx): Promise<string> {
  return await getSettingValue<string>(
    ctx,
    "default_payout_info_status",
    "not_submitted",
  );
}
