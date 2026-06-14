/** Backoffice mutations for managing celebrities and their product picks. */
import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { recordAuditLog } from "../auditLogs/helpers";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import { now } from "../shared/helpers";
import {
  assertPublicProductPick,
  assertUniqueCelebritySlug,
  slugifyCelebrityName,
} from "./helpers";

export const createCelebrity = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const name = args.name.trim();
    if (!name) {
      throw new ConvexError("Name is required");
    }

    const slug = (args.slug?.trim() || slugifyCelebrityName(name)).toLowerCase();
    if (!slug) {
      throw new ConvexError("Slug is required");
    }

    await assertUniqueCelebritySlug(ctx, slug);

    const timestamp = now();
    const celebrityId = await ctx.db.insert("celebrities", {
      name,
      slug,
      title: args.title?.trim() || undefined,
      bio: args.bio?.trim() || undefined,
      avatarUrl: args.avatarUrl?.trim() || undefined,
      isVerified: args.isVerified ?? false,
      isActive: args.isActive ?? true,
      sortOrder: args.sortOrder ?? timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "celebrity.create",
      entity: "celebrities",
      entityId: celebrityId,
      after: { name, slug },
    });

    return celebrityId;
  },
});

export const updateCelebrity = mutation({
  args: {
    celebrityId: v.id("celebrities"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const celebrity = await ctx.db.get(args.celebrityId);
    if (!celebrity) {
      throw new ConvexError("Celebrity not found");
    }

    const patch: Record<string, unknown> = {
      updatedAt: now(),
    };

    if (args.name !== undefined) {
      const name = args.name.trim();
      if (!name) {
        throw new ConvexError("Name cannot be empty");
      }
      patch.name = name;
    }

    if (args.slug !== undefined) {
      const slug = args.slug.trim().toLowerCase();
      if (!slug) {
        throw new ConvexError("Slug cannot be empty");
      }
      await assertUniqueCelebritySlug(ctx, slug, args.celebrityId);
      patch.slug = slug;
    }

    if (args.title !== undefined) {
      patch.title = args.title.trim() || undefined;
    }

    if (args.bio !== undefined) {
      patch.bio = args.bio.trim() || undefined;
    }

    if (args.avatarUrl !== undefined) {
      patch.avatarUrl = args.avatarUrl.trim() || undefined;
    }

    if (args.isVerified !== undefined) {
      patch.isVerified = args.isVerified;
    }

    if (args.isActive !== undefined) {
      patch.isActive = args.isActive;
    }

    if (args.sortOrder !== undefined) {
      patch.sortOrder = args.sortOrder;
    }

    await ctx.db.patch(args.celebrityId, patch);

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "celebrity.update",
      entity: "celebrities",
      entityId: args.celebrityId,
      after: patch,
    });
  },
});

export const addPick = mutation({
  args: {
    celebrityId: v.id("celebrities"),
    productId: v.id("products"),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const celebrity = await ctx.db.get(args.celebrityId);
    if (!celebrity) {
      throw new ConvexError("Celebrity not found");
    }

    await assertPublicProductPick(ctx, args.productId);

    const existing = await ctx.db
      .query("celebrityPicks")
      .withIndex("by_celebrity_product", (q) =>
        q.eq("celebrityId", args.celebrityId).eq("productId", args.productId),
      )
      .unique();

    if (existing) {
      throw new ConvexError("Product is already in this celebrity's picks");
    }

    const timestamp = now();
    const pickId = await ctx.db.insert("celebrityPicks", {
      celebrityId: args.celebrityId,
      productId: args.productId,
      sortOrder: args.sortOrder ?? timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "celebrity.pick.add",
      entity: "celebrityPicks",
      entityId: pickId,
      after: {
        celebrityId: args.celebrityId,
        productId: args.productId,
      },
    });

    return pickId;
  },
});

export const removePick = mutation({
  args: {
    pickId: v.id("celebrityPicks"),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const pick = await ctx.db.get(args.pickId);
    if (!pick) {
      throw new ConvexError("Pick not found");
    }

    await ctx.db.delete(args.pickId);

    await recordAuditLog(ctx, {
      actorId: user._id,
      action: "celebrity.pick.remove",
      entity: "celebrityPicks",
      entityId: args.pickId,
      before: {
        celebrityId: pick.celebrityId,
        productId: pick.productId,
      },
    });
  },
});
