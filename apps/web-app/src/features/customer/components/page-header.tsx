import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

type BackButtonProps = {
  onClick?: () => void;
  className?: string;
  light?: boolean;
};

export function BackButton({ onClick, className = "", light = false }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={onClick ?? (() => navigate(-1))}
      className={
        className ||
        `flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition ${
          light
            ? "bg-white/95 text-gray-800 shadow-md backdrop-blur hover:bg-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`
      }
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  onBack?: () => void;
  trailing?: ReactNode;
  variant?: "default" | "primary";
  bordered?: boolean;
  showBack?: boolean;
};

export function PageHeader({
  title,
  subtitle,
  meta,
  onBack,
  trailing,
  variant = "default",
  bordered = true,
  showBack = true,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  const isPrimary = variant === "primary";

  return (
    <div
      className={
        isPrimary
          ? "bg-[#FF5A00] px-4 pb-4 pt-3 text-white"
          : bordered
            ? "border-b border-gray-100 bg-white px-4 pb-4 pt-3"
            : "bg-white px-4 pb-4 pt-3"
      }
    >
      <div className="flex items-start gap-3">
        {showBack ? (
          <BackButton
            onClick={handleBack}
            light={isPrimary}
            className={
              isPrimary
                ? "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                : undefined
            }
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1
              className={`text-[22px] font-normal leading-tight ${
                isPrimary ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h1>
            {trailing}
          </div>
          {subtitle ? (
            <p
              className={`mt-1 text-sm leading-relaxed ${
                isPrimary ? "text-white/85" : "text-gray-500"
              }`}
            >
              {subtitle}
            </p>
          ) : null}
          {meta ? (
            <p
              className={`mt-2 text-xs font-medium ${
                isPrimary ? "text-white/75" : "text-gray-400"
              }`}
            >
              {meta}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
