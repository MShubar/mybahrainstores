import type { ReactNode } from "react";
import { getCategoryTheme } from "../utils/category-theme";

type CategoryIconProps = {
  slug: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

function IconWatch() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  );
}

function IconPerfume() {
  return (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3h6M10 3v3l-2 3v11a2 2 0 002 2h4a2 2 0 002-2V9l-2-3V3"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2" />
    </>
  );
}

function IconMakeup() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  );
}

function IconPhone() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  );
}

function IconAccessories() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  );
}

function IconGrid() {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  );
}

const SLUG_ICON_PATHS: Record<string, () => ReactNode> = {
  watches: IconWatch,
  perfume: IconPerfume,
  makeup: IconMakeup,
  electronics: IconPhone,
  accessories: IconAccessories,
};

export function CategoryIcon({ slug, name, size = "md" }: CategoryIconProps) {
  const theme = getCategoryTheme(slug);
  const IconPath = SLUG_ICON_PATHS[slug] ?? IconGrid;
  const sizeClass =
    size === "lg"
      ? "h-[4.5rem] w-[4.5rem] [&_svg]:h-8 [&_svg]:w-8"
      : size === "md"
        ? "h-16 w-16 [&_svg]:h-7 [&_svg]:w-7"
        : "h-14 w-14 [&_svg]:h-6 [&_svg]:w-6";

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-2xl ring-1 ${theme.circleClass} ${theme.iconClass}`}
      aria-hidden
    >
      <svg className="flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <IconPath />
      </svg>
      <span className="sr-only">{name}</span>
    </div>
  );
}
