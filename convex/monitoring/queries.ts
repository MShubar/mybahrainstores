import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";

export const getBackofficeMonitoringSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const [auditLogs, systemLogs] = await Promise.all([
      ctx.db.query("auditLogs").order("desc").take(25),
      ctx.db.query("systemLogs").order("desc").take(25),
    ]);

    const errors = systemLogs.filter((log) => log.level === "error");
    const warnings = systemLogs.filter((log) => log.level === "warn");

    return {
      totals: {
        auditLogs: auditLogs.length,
        systemLogs: systemLogs.length,
        errors: errors.length,
        warnings: warnings.length,
      },
      recentAuditLogs: auditLogs,
      recentSystemLogs: systemLogs,
    };
  },
});
