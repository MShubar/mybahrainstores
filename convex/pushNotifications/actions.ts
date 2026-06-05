import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export const sendExpoPushNotification = action({
  args: {
    token: v.string(),
    title: v.string(),
    body: v.string(),
  },
  handler: async (_ctx, args) => {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: args.token,
        title: args.title,
        body: args.body,
        sound: "default",
      }),
    });
  },
});

export const notifyUser = internalAction({
  args: {
    userId: v.id("users"),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const tokens = await ctx.runQuery(
      internal.pushNotifications.queries.listTokensByUser,
      { userId: args.userId },
    );

    await Promise.all(
      tokens.map(async (entry) => {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: entry.token,
            title: args.title,
            body: args.body,
            sound: "default",
          }),
        });
      }),
    );
  },
});
