import type { UserRole } from "@my-bahrain/types";

const roles: UserRole[] = ["customer", "store", "backoffice"];

export function DashboardHome() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Customer, store, and backoffice experiences share this web application.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {roles.map((role) => (
          <li
            key={role}
            className="rounded-full bg-white px-4 py-1 text-sm font-medium capitalize text-gray-700 shadow-sm ring-1 ring-gray-200"
          >
            {role}
          </li>
        ))}
      </ul>
    </main>
  );
}
