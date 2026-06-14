/** Customer delivery address queries. */
import { query } from "../_generated/server";
import {
  formatAddressSummary,
  getDefaultAddressForUser,
  listAddressesForUser,
  requireCustomerUser,
} from "./helpers";

export const listMy = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCustomerUser(ctx);
    const addresses = await listAddressesForUser(ctx, user._id);

    return addresses.map((address) => ({
      ...address,
      summary: formatAddressSummary(address),
    }));
  },
});

export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireCustomerUser(ctx);
    const address = await getDefaultAddressForUser(ctx, user._id);

    if (!address) {
      return null;
    }

    return {
      ...address,
      summary: formatAddressSummary(address),
    };
  },
});
