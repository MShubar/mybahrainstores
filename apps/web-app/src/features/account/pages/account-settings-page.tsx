import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { accountDeletionSchema } from "@my-bahrain/validators";
import { PageHeader } from "../../customer/components/page-header";
import { homeForRole } from "../../auth/utils/home-for-role";

type AccountSettingsPageProps = {
  customerMode?: boolean;
};

export function AccountSettingsPage({ customerMode = false }: AccountSettingsPageProps) {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.queries.me);
  const deletionStatus = useQuery(api.users.queries.getAccountDeletionStatus);
  const deleteAccount = useMutation(api.users.mutations.deleteCurrentUserAccount);

  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user === undefined || deletionStatus === undefined) {
    return (
      <div className={customerMode ? "bg-[#F7F7F7] px-4 py-12 text-gray-500" : "mx-auto max-w-lg p-6"}>
        Loading account...
      </div>
    );
  }

  if (!user || deletionStatus.deletedAt) {
    return (
      <div className={customerMode ? "space-y-4 px-4 py-12" : "mx-auto max-w-lg space-y-4 p-6"}>
        <p className="text-gray-600">This account is no longer available.</p>
        <Link to="/login" className="font-semibold text-[#FF5A00] underline">
          Go to login
        </Link>
      </div>
    );
  }

  async function handleDeleteAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = accountDeletionSchema.safeParse({ confirmPhrase });
    if (!parsed.success) {
      setError("Type DELETE to confirm account deletion.");
      return;
    }

    if (deletionStatus?.blocked) {
      setError(deletionStatus.reasons.join(" "));
      return;
    }

    const confirmed = confirm(
      "This permanently deletes your account and removes personal data. Continue?",
    );
    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccount({ confirmPhrase: parsed.data.confirmPhrase });
      await signOut();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete account");
    } finally {
      setLoading(false);
    }
  }

  const homePath = user.role ? homeForRole(user.role) : "/customer";
  const backPath = customerMode ? "/account" : homePath;

  return (
    <div className={customerMode ? "min-h-full bg-[#F7F7F7] pb-8" : "mx-auto max-w-lg space-y-8 p-6"}>
      {customerMode ? (
        <PageHeader
          title="Account settings"
          subtitle="Manage your profile and account data."
          onBack={() => navigate(backPath)}
        />
      ) : (
        <div>
          <Link to={backPath} className="text-sm text-gray-500 underline">
            Back to dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold">Account settings</h1>
          <p className="mt-2 text-gray-600">Manage your profile and account data.</p>
        </div>
      )}

      <div className={customerMode ? "space-y-4 px-4 pt-4" : "space-y-8"}>
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Name</dt>
              <dd className="mt-1 font-semibold text-gray-900">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</dt>
              <dd className="mt-1 font-semibold text-gray-900">{user.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">Role</dt>
              <dd className="mt-1 font-semibold capitalize text-gray-900">{user.role ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-bold text-red-900">Delete account</h2>
          <p className="mt-2 text-sm leading-relaxed text-red-800">
            This removes your personal information, signs you out everywhere, and deactivates any
            stores you own. Order records are kept for compliance but delivery details are
            anonymized.
          </p>

          {deletionStatus.blocked ? (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-red-800">
              {deletionStatus.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl border border-red-300 bg-white p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3">
            <label className="block text-sm text-red-900">
              Type <strong>DELETE</strong> to confirm
              <input
                value={confirmPhrase}
                onChange={(event) => setConfirmPhrase(event.target.value)}
                className="mt-2 w-full rounded-xl border border-red-200 bg-white p-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
                placeholder="DELETE"
                disabled={deletionStatus.blocked || loading}
              />
            </label>

            <button
              type="submit"
              disabled={deletionStatus.blocked || loading}
              className="w-full rounded-xl bg-red-700 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete my account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
