import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Link } from "react-router-dom";

export function StorePayoutSettingsPage() {
  const myStore = useQuery(api.stores.queries.getMyStore);
  const updatePayoutInfo = useMutation(api.stores.mutations.updateMyStorePayoutInfo);

  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!myStore) {
      return;
    }

    setBankName(myStore.bankName ?? "");
    setIban(myStore.iban ?? "");
    setAccountHolderName(myStore.accountHolderName ?? "");
  }, [myStore?._id, myStore?.bankName, myStore?.iban, myStore?.accountHolderName]);

  if (myStore === undefined) {
    return <div>Loading payout settings...</div>;
  }

  if (!myStore) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Payout Information</h1>
        <p className="mt-2 text-gray-600">
          Create your store profile first to add payout details.
        </p>
        <Link to="/store" className="mt-4 inline-block underline">
          Go to store dashboard
        </Link>
      </div>
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!myStore) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updatePayoutInfo({
        storeId: myStore._id,
        bankName,
        iban,
        accountHolderName,
      });
      setSuccess(
        "Payout information saved. Backoffice will review before manual transfers.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save payout info");
    } finally {
      setLoading(false);
    }
  }

  const status = myStore.payoutInfoStatus ?? "not_submitted";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/store" className="text-sm text-gray-500 underline">
          ← Store dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Payout Information</h1>
        <p className="mt-2 text-gray-600">
          Add your bank details for manual payouts. Transfers are processed by
          backoffice after review — automated payouts are not live yet.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-500">Review status</div>
        <div className="mt-1 font-medium capitalize">{status.replace(/_/g, " ")}</div>
      </div>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-green-800">
          {success}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-white p-5">
        <label className="block">
          <span className="text-sm font-medium">Bank name</span>
          <input
            className="mt-1 w-full rounded border p-2"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">IBAN</span>
          <input
            className="mt-1 w-full rounded border p-2 font-mono uppercase"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            placeholder="BH00XXXX00000000000000"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Account holder name</span>
          <input
            className="mt-1 w-full rounded border p-2"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save payout information"}
        </button>
      </form>
    </div>
  );
}
