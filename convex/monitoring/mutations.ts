import { internalMutation, mutation } from "../_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "../auth/currentUser";
import { enforceRateLimit } from "../rateLimit/helpers";
import { recordSystemLog, type LogLevel } from "./helpers";

export const logClientError = mutation({
  args: {
    message: v.string(),
    context: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    await enforceRateLimit(ctx, {
      key: `client_log:${user?._id ?? "anonymous"}`,
      limit: 30,
      windowMs: 60 * 1000,
    });

    return await recordSystemLog(ctx, {
      userId: user?._id,
      level: "error",
      source: "client",
      message: args.message,
      context: args.context,
    });
  },
});

export const logServerError = internalMutation({
  args: {
    message: v.string(),
    level: v.optional(v.union(v.literal("error"), v.literal("warn"), v.literal("info"))),
    context: v.optional(v.any()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await recordSystemLog(ctx, {
      userId: args.userId,
      level: (args.level ?? "error") as LogLevel,
      source: "server",
      message: args.message,
      context: args.context,
    });
  },
});
