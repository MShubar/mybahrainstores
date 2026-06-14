import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";
import {
  areStoreLeadsEnabled,
  enrichStoreLead,
  getStoreLeadStatuses,
} from "./helpers";

export const isApplicationOpen = query({
  args: {},
  handler: async (ctx) => {
    return await areStoreLeadsEnabled(ctx);
  },
});

export const listBackofficeStoreLeads = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const leads = await ctx.db.query("storeLeads").order("desc").collect();

    return await Promise.all(leads.map((lead) => enrichStoreLead(ctx, lead)));
  },
});

export const getBackofficeStoreLeadStatuses = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    return await getStoreLeadStatuses(ctx);
  },
});
