import { query } from "../_generated/server";
import { requireCurrentUser } from "../auth/currentUser";

export const listMyNotifications = query({
  args: {},

  handler: async (ctx) => {
    const user = await requireCurrentUser(ctx);

    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) =>
        q.eq("userId", user._id)
      )
      .order("desc")
      .collect();
  },
});