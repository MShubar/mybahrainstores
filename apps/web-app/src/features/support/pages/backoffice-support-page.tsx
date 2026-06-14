import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const STATUSES = ["open", "in_progress", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export function BackofficeSupportPage() {
  const tickets = useQuery(api.support.queries.listBackofficeTickets);
  const updateTicketStatus = useMutation(
    api.support.mutations.updateTicketStatus,
  );

  if (tickets === undefined) {
    return <div>Loading support tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support & Disputes</h1>
        <p className="mt-1 text-gray-600">
          Manage customer and store support requests.
        </p>
      </div>

      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600">
            No support tickets yet.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <div>
                  <h2 className="text-lg font-bold">{ticket.subject}</h2>
                  <p className="mt-2 text-sm text-gray-600">{ticket.message}</p>

                  <div className="mt-3 text-xs text-gray-500">
                    User: {ticket.userId}
                  </div>
                </div>

                <div className="grid gap-2 md:w-64">
                  <select
                    className="rounded border p-2"
                    value={ticket.status}
                    onChange={(e) =>
                      void updateTicketStatus({
                        ticketId: ticket._id,
                        status: e.target.value,
                        priority: ticket.priority,
                      })
                    }
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    className="rounded border p-2"
                    value={ticket.priority}
                    onChange={(e) =>
                      void updateTicketStatus({
                        ticketId: ticket._id,
                        status: ticket.status,
                        priority: e.target.value,
                      })
                    }
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
