import { mutation } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireCurrentUser } from "../auth/currentUser";
import { requireBackoffice } from "../auth/permissions";

export const createTicket = mutation({
  args: {
    orderId: v.optional(v.id("orders")),
    storeId: v.optional(v.id("stores")),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    const now = Date.now();

    const ticketId = await ctx.db.insert("supportTickets", {
      userId: user._id,
      orderId: args.orderId,
      storeId: args.storeId,
      subject: args.subject,
      message: args.message,
      status: "open",
      priority: "medium",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("analyticsEvents", {
      userId: user._id,
      event: "support_ticket_created",
      entityType: "supportTicket",
      entityId: ticketId,
      metadata: { subject: args.subject },
      createdAt: now,
    });

    return ticketId;
  },
});

export const updateTicketStatus = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    status: v.string(),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireCurrentUser(ctx);
    requireBackoffice(user);

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new ConvexError("Ticket not found");
    }

    await ctx.db.patch(args.ticketId, {
      status: args.status,
      priority: args.priority ?? ticket.priority,
      updatedAt: Date.now(),
    });

    return args.ticketId;
  },
});
