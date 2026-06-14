import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogoutButton } from "../../features/auth/components/logout-button";

export function BackofficeLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { label: "Dashboard", to: "/backoffice" },
    { label: "Launch Metrics", to: "/backoffice/launch-metrics" },
    { label: "Categories", to: "/backoffice/categories" },
    { label: "Stores", to: "/backoffice/stores" },
    { label: "Store Leads", to: "/backoffice/store-leads" },
    { label: "Celebrities", to: "/backoffice/celebrities" },
    { label: "Products", to: "/backoffice/products" },
    { label: "Products", to: "/backoffice/products" },
    { label: "Settings", to: "/backoffice/settings" },
    { label: "Users", to: "/backoffice/users" },
    { label: "Orders", to: "/backoffice/orders" },
    { label: "Payouts", to: "/backoffice/payouts" },
    { label: "Support", to: "/backoffice/support" },
    { label: "Revenue Reports", to: "/backoffice/reports/revenue" },
    { label: "Audit Logs", to: "/backoffice/audit-logs" },
    { label: "Monitoring", to: "/backoffice/monitoring" },
    { label: "Analytics", to: "/backoffice/analytics" },
    { label: "Monitoring", to: "/backoffice/monitoring" },
    { label: "Analytics", to: "/backoffice/analytics" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r bg-white p-4">
        <h1 className="mb-6 text-xl font-bold">Backoffice</h1>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/backoffice"}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-end gap-3 border-b bg-white p-4">
          <Link to="/account" className="text-sm underline">
            Account
          </Link>
          <LogoutButton />
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}