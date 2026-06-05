import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";

export const listBackofficeAuditLogs = query({
  args: {},

  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await ctx.db.query("auditLogs").order("desc").take(100);
  },
});