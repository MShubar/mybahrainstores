import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

type AuditLogInput = {
  actorId?: Id<"users">;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
};

export async function recordAuditLog(
  ctx: MutationCtx,
  input: AuditLogInput,
): Promise<Id<"auditLogs">> {
  return await ctx.db.insert("auditLogs", {
    actorId: input.actorId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    before: input.before,
    after: input.after,
    createdAt: Date.now(),
  });
}
