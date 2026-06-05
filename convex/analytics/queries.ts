import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";

export const getBackofficeAnalyticsSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const events = await ctx.db.query("analyticsEvents").collect();

    const countsByEvent = events.reduce<Record<string, number>>((result, event) => {
      result[event.event] = (result[event.event] ?? 0) + 1;
      return result;
    }, {});

    return {
      totalEvents: events.length,
      countsByEvent,
    };
  },
});
