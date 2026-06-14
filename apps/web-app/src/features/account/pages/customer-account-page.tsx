import { useMemo, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { formatPrice } from "../../../lib/format-price";
import { AccountMenuItem } from "../components/account-menu-item";
import { formatAccountName, getAccountInitials } from "../utils/account-helpers";
import { AccountDeliverySection } from "../../customer/components/account-delivery-section";

function StatMiniCard({
  icon,
  label,
  value,
  href,
  actionLabel,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  actionLabel?: string;
}) {
  const body = (
    <>
      <div className="mb-2 text-[#FF5A00]">{icon}</div>
      <p className="text-[11px] font-medium text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-gray-900">{value}</p>
      {actionLabel ? (
        <p className="mt-1 text-[11px] font-bold text-[#FF5A00]">{actionLabel}</p>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="flex min-w-0 flex-1 flex-col rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
      >
        {body}
      </Link>
    );
  }

  return <div className="flex min-w-0 flex-1 flex-col rounded-xl bg-white p-3 shadow-sm">{body}</div>;
}

export function CustomerAccountPage() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.queries.me);
  const orders = useQuery(api.orders.queries.listMyOrders);
  const currency = useQuery(api.settings.queries.getValueByKey, { key: "currency" });

  const summary = useMemo(() => {
    if (!orders) {
      return null;
    }

    const currencyCode = typeof currency === "string" ? currency : "BHD";
    const paidOrders = orders.filter((order) => order.trackingSummary.isPaid);
    const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const activeOrders = orders.filter(
      (order) =>
        !order.trackingSummary.isDelivered && !order.trackingSummary.isCancelled,
    ).length;
    const completedOrders = orders.filter(
      (order) =>
        order.trackingSummary.isDelivered || order.trackingSummary.isCancelled,
    ).length;

    return {
      currencyCode,
      totalSpent,
      activeOrders,
      completedOrders,
    };
  }, [currency, orders]);

  async function handleLogout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  if (user === undefined || orders === undefined || currency === undefined) {
    return (
      <div className="min-h-full bg-[#F7F7F7] pb-8">
        <div className="animate-pulse bg-white px-4 pb-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-5 w-36 rounded bg-gray-100" />
              <div className="h-4 w-24 rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="mx-4 mt-4 h-40 animate-pulse rounded-2xl bg-orange-100/60" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = formatAccountName(user.name);

  return (
    <div className="min-h-full bg-[#F7F7F7] pb-8">
      <div className="bg-white px-4 pb-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#FFE8D9] text-lg font-bold text-[#FF5A00]">
              {getAccountInitials(user.name)}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold capitalize text-gray-900">{displayName}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <span aria-hidden>🇧🇭</span>
                <span>Bahrain</span>
              </p>
            </div>
          </div>

          <Link
            to="/account/settings"
            aria-label="Account settings"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </div>

      <AccountDeliverySection />

      {summary ? (
        <div className="mx-4 -mt-1 rounded-2xl bg-gradient-to-br from-[#FFF0E6] via-[#FFE8D9] to-[#FFD4BF] p-4 shadow-celebrity">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-gray-600">Total spent</p>
              <p className="text-2xl font-extrabold text-[#FF5A00]">
                {formatPrice(summary.totalSpent, summary.currencyCode)}
              </p>
            </div>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#FF5A00]">
              Bahrain Store
            </span>
          </div>

          <div className="flex gap-2">
            <StatMiniCard
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              label="Active orders"
              value={String(summary.activeOrders)}
              href="/customer/orders"
            />
            <StatMiniCard
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
              label="Completed"
              value={String(summary.completedOrders)}
              href="/customer/orders"
            />
            <StatMiniCard
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
                  />
                </svg>
              }
              label="Categories"
              value="Browse"
              href="/customer/browse"
              actionLabel="Shop now"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-4 mt-5 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <AccountMenuItem
          to="/customer/support"
          label="Help & support"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <AccountMenuItem
          to="/customer/legal/privacy"
          label="Privacy policy"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />
        <AccountMenuItem
          to="/customer/legal/terms"
          label="Terms & conditions"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <AccountMenuItem
          to="/account/settings"
          label="Account settings"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
        <AccountMenuItem
          onClick={() => void handleLogout()}
          label="Log out"
          destructive
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          }
        />
      </div>

      {user.email ? (
        <p className="mt-4 px-4 text-center text-xs text-gray-400">{user.email}</p>
      ) : null}
    </div>
  );
}
