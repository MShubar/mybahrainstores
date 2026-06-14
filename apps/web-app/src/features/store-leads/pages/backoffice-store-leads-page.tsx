import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

function getWebAppSignupUrl(): string {
  return `${window.location.origin}/signup`;
}

export function BackofficeStoreLeadsPage() {
  const leads = useQuery(api.storeLeads.queries.listBackofficeStoreLeads);
  const statuses = useQuery(api.storeLeads.queries.getBackofficeStoreLeadStatuses);

  const updateStoreLeadStatus = useMutation(
    api.storeLeads.mutations.updateStoreLeadStatus,
  );
  const convertStoreLead = useMutation(api.storeLeads.mutations.convertStoreLead);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  if (leads === undefined || statuses === undefined) {
    return <div>Loading store leads...</div>;
  }

  async function handleStatusChange(
    leadId: Id<"storeLeads">,
    status: string,
    currentNotes?: string,
  ) {
    setError("");
    setPendingId(leadId);

    try {
      await updateStoreLeadStatus({
        leadId,
        status,
        reviewNotes: notes[leadId] ?? currentNotes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    } finally {
      setPendingId(null);
    }
  }

  async function handleConvert(leadId: Id<"storeLeads">) {
    const confirmed = confirm(
      "Convert this lead into a store account? The applicant must already have signed up with the same email.",
    );
    if (!confirmed) {
      return;
    }

    setError("");
    setPendingId(leadId);

    try {
      const result = await convertStoreLead({ leadId });

      if (!result.hasStoreProfile) {
        alert(
          `Account converted. Ask the store owner to complete their profile at /store.`,
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert lead");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Leads</h1>
        <p className="mt-1 text-gray-600">
          Review applications, contact store owners, and convert approved leads
          into store accounts.
        </p>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        {leads.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-gray-600">
            No store applications yet.
          </div>
        ) : (
          leads.map(({ lead, categories, linkedUser, linkedStore }) => (
            <div key={lead._id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold">{lead.businessName}</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase">
                      {lead.status}
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-gray-900">Contact</dt>
                      <dd>
                        {lead.contactName} · {lead.email}
                        {lead.phone ? ` · ${lead.phone}` : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900">City</dt>
                      <dd>{lead.city}</dd>
                    </div>
                    {categories.length > 0 ? (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-gray-900">Categories</dt>
                        <dd>{categories.map((category) => category.name).join(", ")}</dd>
                      </div>
                    ) : null}
                    {lead.message ? (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-gray-900">Message</dt>
                        <dd>{lead.message}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="font-medium text-gray-900">Submitted</dt>
                      <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-900">Linked account</dt>
                      <dd>
                        {linkedUser
                          ? `${linkedUser.name ?? "Unnamed"} (${linkedUser.role ?? "no role"})`
                          : "No signup yet"}
                      </dd>
                    </div>
                    {linkedStore ? (
                      <div>
                        <dt className="font-medium text-gray-900">Store profile</dt>
                        <dd>{linkedStore.name}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="grid w-full gap-3 lg:max-w-sm">
                  <select
                    className="rounded border p-2"
                    value={lead.status}
                    disabled={lead.status === "converted" || pendingId === lead._id}
                    onChange={(e) =>
                      void handleStatusChange(lead._id, e.target.value, lead.reviewNotes)
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <textarea
                    className="min-h-24 rounded border p-2 text-sm"
                    placeholder="Internal review notes"
                    value={notes[lead._id] ?? lead.reviewNotes ?? ""}
                    onChange={(e) =>
                      setNotes((current) => ({
                        ...current,
                        [lead._id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    type="button"
                    disabled={pendingId === lead._id}
                    onClick={() =>
                      void handleStatusChange(
                        lead._id,
                        "contacted",
                        notes[lead._id] ?? lead.reviewNotes,
                      )
                    }
                    className="rounded border px-3 py-2 text-sm"
                  >
                    Mark contacted
                  </button>

                  {lead.status !== "converted" ? (
                    <button
                      type="button"
                      disabled={pendingId === lead._id}
                      onClick={() => void handleConvert(lead._id)}
                      className="rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50"
                    >
                      Convert to store account
                    </button>
                  ) : null}

                  {!linkedUser ? (
                    <p className="text-xs text-gray-500">
                      Invite signup:{" "}
                      <a href={getWebAppSignupUrl()} className="underline">
                        {getWebAppSignupUrl()}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
