import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export type LogLevel = "error" | "warn" | "info";
export type LogSource = "client" | "server";

type SystemLogInput = {
  userId?: Id<"users">;
  level: LogLevel;
  source: LogSource;
  message: string;
  context?: unknown;
};

export async function recordSystemLog(
  ctx: MutationCtx,
  input: SystemLogInput,
): Promise<Id<"systemLogs">> {
  const message = input.message.trim();

  if (!message) {
    throw new ConvexError("Log message is required");
  }

  return await ctx.db.insert("systemLogs", {
    userId: input.userId,
    level: input.level,
    source: input.source,
    message: message.slice(0, 2000),
    context: input.context,
    createdAt: Date.now(),
  });
}
