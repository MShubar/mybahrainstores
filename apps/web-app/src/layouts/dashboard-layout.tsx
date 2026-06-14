import { ReactNode } from "react";
import { LogoutButton } from "../features/auth/components/logout-button";
import { DemoAccountBanner } from "../features/demo/components/demo-account-banner";
import { Link } from "react-router-dom";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
  <h2 className="mb-6 text-xl font-bold">RandomStores</h2>

  <nav className="space-y-2">
    <Link
      to="/store"
      className="block rounded px-3 py-2 hover:bg-gray-100"
    >
      Store Dashboard
    </Link>

    <Link
      to="/store/products"
      className="block rounded px-3 py-2 hover:bg-gray-100"
    >
      Products
    </Link>
    <Link to="/customer/orders">Orders</Link>
    <Link to="/customer/cart">Cart</Link>
    <Link to="/store/orders">Orders</Link>
    <Link
      to="/store/analytics"
      className="block rounded px-3 py-2 hover:bg-gray-100"
    >
      Analytics
    </Link>
    <Link
      to="/store/payout-settings"
      className="block rounded px-3 py-2 hover:bg-gray-100"
    >
      Payout Information
    </Link>
  </nav>
</aside>

      <main className="flex-1">
        <DemoAccountBanner />
        <header className="flex items-center justify-end gap-3 border-b p-4">
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