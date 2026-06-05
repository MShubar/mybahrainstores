import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { enforceRateLimit } from "../rateLimit/helpers";
import { assertImageUpload } from "./helpers";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    await enforceRateLimit(ctx, {
      key: `upload:${user._id}`,
      limit: 20,
      windowMs: 60 * 1000,
    });

    return await ctx.storage.generateUploadUrl();
  },
});

export const saveUploadedFile = mutation({
  args: {
    storageId: v.id("_storage"),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    fileName: v.optional(v.string()),
    contentType: v.optional(v.string()),
    size: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);

    assertImageUpload(args.contentType, args.size);

    const url = await ctx.storage.getUrl(args.storageId);

    if (!url) {
      throw new Error("File URL not found");
    }

    const fileId = await ctx.db.insert("files", {
      storageId: args.storageId,
      url,
      uploadedBy: user._id,
      entityType: args.entityType,
      entityId: args.entityId,
      fileName: args.fileName,
      contentType: args.contentType,
      size: args.size,
      createdAt: Date.now(),
    });

    return {
      fileId,
      url,
    };
  },
});
