import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function BackofficeUsersPage() {
  const users = useQuery(api.users.queries.listBackofficeUsers);
  const promoteToBackoffice = useMutation(api.users.mutations.promoteToBackoffice);

  if (users === undefined) {
    return <div>Loading users...</div>;
  }

  async function handlePromote(userId: Id<"users">) {
    await promoteToBackoffice({ userId });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-gray-600">
          Manage platform users and promote admins.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="p-3">{user.name ?? "—"}</td>
                <td className="p-3">{user.email ?? "—"}</td>
                <td className="p-3">{user.role ?? "—"}</td>
                <td className="p-3 text-right">
                  {user.role !== "backoffice" && (
                    <button
                      type="button"
                      onClick={() => void handlePromote(user._id)}
                      className="rounded border px-3 py-1"
                    >
                      Promote to backoffice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
