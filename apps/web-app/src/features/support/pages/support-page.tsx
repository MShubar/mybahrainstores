import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

type SupportPageProps = {
  embedded?: boolean;
};

export function SupportPage({ embedded = false }: SupportPageProps) {
  const tickets = useQuery(api.support.queries.listMyTickets);
  const createTicket = useMutation(api.support.mutations.createTicket);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    await createTicket({
      subject,
      message,
    });

    setSubject("");
    setMessage("");
  }

  if (tickets === undefined) {
    return <div className="text-gray-500">Loading support...</div>;
  }

  return (
    <div className="space-y-4">
      {!embedded ? (
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="mt-1 text-gray-600">
            Contact support or view your previous tickets.
          </p>
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card"
      >
        <h2 className="text-base font-bold text-gray-900">Create ticket</h2>

        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-orange-100"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            className="min-h-32 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FF5A00] focus:ring-4 focus:ring-orange-100"
            placeholder="How can we help?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FF5A00] py-3 text-sm font-bold text-white shadow-celebrity transition hover:bg-[#E65100]"
          >
            Submit ticket
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
        <h2 className="text-base font-bold text-gray-900">My tickets</h2>

        <div className="mt-4 space-y-3">
          {tickets.length === 0 ? (
            <p className="text-sm text-gray-500">No support tickets yet.</p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold capitalize text-gray-600 ring-1 ring-gray-200">
                    {ticket.status.replaceAll("_", " ")}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-gray-600">{ticket.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
