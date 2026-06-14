import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { recordAuditLog } from "../auditLogs/helpers";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { enforceRateLimit } from "../rateLimit/helpers";
import { now } from "../shared/helpers";
import {
  areStoreLeadsEnabled,
  assertLeadCanBeConverted,
  assertNoActiveLeadForEmail,
  assertValidStoreLeadStatus,
  buildLeadReviewPatch,
  findStoreByOwner,
  findUserByEmail,
  getDefaultStoreLeadStatus,
  normalizeLeadEmail,
} from "./helpers";

export const submitStoreLead = mutation({
  args: {
    businessName: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    city: v.string(),
    categoryIds: v.optional(v.array(v.id("categories"))),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const enabled = await areStoreLeadsEnabled(ctx);
    if (!enabled) {
      throw new ConvexError("Store applications are currently closed");
    }

    const businessName = args.businessName.trim();
    const contactName = args.contactName.trim();
    const email = normalizeLeadEmail(args.email);
    const city = args.city.trim();
    const phone = args.phone?.trim() || undefined;
    const message = args.message?.trim() || undefined;

    if (!businessName || !contactName || !email || !city) {
      throw new ConvexError("Please fill in all required fields");
    }

    if (!email.includes("@")) {
      throw new ConvexError("Please enter a valid email address");
    }

    await enforceRateLimit(ctx, {
      key: `store-lead:${email}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    });

    await assertNoActiveLeadForEmail(ctx, email);

    if (args.categoryIds?.length) {
      for (const categoryId of args.categoryIds) {
        const category = await ctx.db.get(categoryId);
        if (!category?.isActive) {
          throw new ConvexError("One or more selected categories are invalid");
        }
      }
    }

    const status = await getDefaultStoreLeadStatus(ctx);
    await assertValidStoreLeadStatus(ctx, status);

    const timestamp = now();

    return await ctx.db.insert("storeLeads", {
      businessName,
      contactName,
      email,
      phone,
      city,
      categoryIds: args.categoryIds,
      message,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
});

export const updateStoreLeadStatus = mutation({
  args: {
    leadId: v.id("storeLeads"),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new ConvexError("Store lead not found");
    }

    await assertValidStoreLeadStatus(ctx, args.status);

    if (lead.status === "converted" && args.status !== "converted") {
      throw new ConvexError("Converted leads cannot be changed");
    }

    const patch = buildLeadReviewPatch(lead, {
      status: args.status,
      reviewNotes: args.reviewNotes,
      reviewerId: user._id,
    });

    await ctx.db.patch(args.leadId, patch);

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_lead_status_updated",
      entity: "storeLeads",
      entityId: args.leadId,
      before: { status: lead.status, reviewNotes: lead.reviewNotes },
      after: { status: args.status, reviewNotes: patch.reviewNotes },
    });

    return args.leadId;
  },
});

export const convertStoreLead = mutation({
  args: {
    leadId: v.id("storeLeads"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new ConvexError("Store lead not found");
    }

    assertLeadCanBeConverted(lead);

    const applicant = await findUserByEmail(ctx, lead.email);
    if (!applicant) {
      throw new ConvexError(
        "No account found for this email. Ask the applicant to sign up first, then convert again.",
      );
    }

    if (applicant.role !== "store") {
      await ctx.db.patch(applicant._id, {
        role: "store",
        updatedAt: now(),
      });

      await recordAuditLog(ctx, {
        actorId: user._id,
        action: "user_role_updated",
        entity: "users",
        entityId: applicant._id,
        before: { role: applicant.role },
        after: { role: "store" },
      });
    }

    const store = await findStoreByOwner(ctx, applicant._id);
    const timestamp = now();

    await ctx.db.patch(args.leadId, {
      status: "converted",
      convertedUserId: applicant._id,
      convertedStoreId: store?._id,
      reviewedBy: user._id,
      reviewedAt: timestamp,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "store_lead_converted",
      entity: "storeLeads",
      entityId: args.leadId,
      before: { status: lead.status },
      after: {
        status: "converted",
        convertedUserId: applicant._id,
        convertedStoreId: store?._id ?? null,
      },
    });

    return {
      leadId: args.leadId,
      userId: applicant._id,
      storeId: store?._id ?? null,
      hasStoreProfile: Boolean(store),
    };
  },
});
