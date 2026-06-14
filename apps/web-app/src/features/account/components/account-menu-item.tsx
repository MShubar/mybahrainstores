import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type AccountMenuItemProps = {
  to?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  trailing?: ReactNode;
  destructive?: boolean;
};

export function AccountMenuItem({
  to,
  onClick,
  icon,
  label,
  trailing,
  destructive = false,
}: AccountMenuItemProps) {
  const content = (
    <>
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          destructive ? "bg-red-50 text-red-600" : "bg-orange-50 text-[#FF5A00]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className={`text-[15px] font-semibold ${destructive ? "text-red-700" : "text-gray-900"}`}>
          {label}
        </p>
      </div>

      {trailing ? (
        <span className="flex-shrink-0 text-sm font-medium text-gray-500">{trailing}</span>
      ) : null}

      {!destructive ? (
        <svg
          className="h-5 w-5 flex-shrink-0 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      ) : null}
    </>
  );

  const className =
    "flex w-full items-center gap-3.5 border-b border-gray-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-gray-50 active:bg-gray-100";

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
