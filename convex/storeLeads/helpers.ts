import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getSettingValue } from "../settings/helpers";
import { now } from "../shared/helpers";

type Ctx = QueryCtx | MutationCtx;

const ACTIVE_LEAD_STATUSES = new Set(["pending", "in_review", "approved", "contacted"]);

export function normalizeLeadEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function areStoreLeadsEnabled(ctx: Ctx): Promise<boolean> {
  return await getSettingValue<boolean>(ctx, "store_leads_enabled", true);
}

export async function getStoreLeadStatuses(ctx: Ctx): Promise<string[]> {
  return await getSettingValue<string[]>(ctx, "store_lead_statuses", [
    "pending",
    "in_review",
    "approved",
    "contacted",
    "converted",
    "rejected",
  ]);
}

export async function getDefaultStoreLeadStatus(ctx: Ctx): Promise<string> {
  return await getSettingValue<string>(ctx, "default_store_lead_status", "pending");
}

export async function assertValidStoreLeadStatus(
  ctx: Ctx,
  status: string,
): Promise<void> {
  const allowed = await getStoreLeadStatuses(ctx);
  if (!allowed.includes(status)) {
    throw new ConvexError(`Invalid store lead status: ${status}`);
  }
}

export async function assertNoActiveLeadForEmail(
  ctx: Ctx,
  email: string,
): Promise<void> {
  const existing = await ctx.db
    .query("storeLeads")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  const hasActive = existing.some((lead) => ACTIVE_LEAD_STATUSES.has(lead.status));
  if (hasActive) {
    throw new ConvexError(
      "An application for this email is already being reviewed.",
    );
  }
}

export async function findUserByEmail(
  ctx: Ctx,
  email: string,
): Promise<Doc<"users"> | null> {
  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", email))
    .first();

  if (!user || user.deletedAt) {
    return null;
  }

  return user;
}

export async function findStoreByOwner(
  ctx: Ctx,
  ownerId: Id<"users">,
): Promise<Doc<"stores"> | null> {
  return await ctx.db
    .query("stores")
    .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
    .first();
}

export async function enrichStoreLead(
  ctx: Ctx,
  lead: Doc<"storeLeads">,
): Promise<{
  lead: Doc<"storeLeads">;
  categories: Array<{ _id: Id<"categories">; name: string }>;
  linkedUser: { _id: Id<"users">; name: string | undefined; role: string | undefined } | null;
  linkedStore: { _id: Id<"stores">; name: string } | null;
}> {
  const categoryIds = lead.categoryIds ?? [];
  const categories = (
    await Promise.all(categoryIds.map((categoryId) => ctx.db.get(categoryId)))
  )
    .filter((category): category is Doc<"categories"> => category !== null)
    .map((category) => ({ _id: category._id, name: category.name }));

  const linkedUser = lead.convertedUserId
    ? await ctx.db.get(lead.convertedUserId)
    : await findUserByEmail(ctx, lead.email);

  const linkedStore = lead.convertedStoreId
    ? await ctx.db.get(lead.convertedStoreId)
    : linkedUser
      ? await findStoreByOwner(ctx, linkedUser._id)
      : null;

  return {
    lead,
    categories,
    linkedUser: linkedUser
      ? {
          _id: linkedUser._id,
          name: linkedUser.name,
          role: linkedUser.role,
        }
      : null,
    linkedStore: linkedStore
      ? { _id: linkedStore._id, name: linkedStore.name }
      : null,
  };
}

export function assertLeadCanBeConverted(lead: Doc<"storeLeads">): void {
  if (lead.status === "converted") {
    throw new ConvexError("Lead is already converted");
  }

  if (lead.status === "rejected") {
    throw new ConvexError("Rejected leads cannot be converted");
  }

  if (lead.status !== "approved" && lead.status !== "contacted") {
    throw new ConvexError("Approve and contact the lead before converting");
  }
}

export function buildLeadReviewPatch(
  lead: Doc<"storeLeads">,
  args: {
    status: string;
    reviewNotes?: string;
    reviewerId: Id<"users">;
  },
): Partial<Doc<"storeLeads">> {
  const timestamp = now();

  return {
    status: args.status,
    reviewNotes: args.reviewNotes ?? lead.reviewNotes,
    reviewedBy: args.reviewerId,
    reviewedAt: timestamp,
    updatedAt: timestamp,
  };
}
