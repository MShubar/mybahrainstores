type CategoryTheme = {
  emoji: string;
  circleClass: string;
  cardClass: string;
  iconClass: string;
};

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  watches: {
    emoji: "⌚",
    circleClass: "bg-slate-100 ring-slate-200",
    cardClass: "from-slate-50/80 to-white",
    iconClass: "text-slate-600",
  },
  perfume: {
    emoji: "🌸",
    circleClass: "bg-fuchsia-50 ring-fuchsia-100",
    cardClass: "from-fuchsia-50/80 to-white",
    iconClass: "text-fuchsia-600",
  },
  makeup: {
    emoji: "💄",
    circleClass: "bg-pink-50 ring-pink-100",
    cardClass: "from-pink-50/80 to-white",
    iconClass: "text-pink-600",
  },
  electronics: {
    emoji: "📱",
    circleClass: "bg-violet-50 ring-violet-100",
    cardClass: "from-violet-50/80 to-white",
    iconClass: "text-violet-600",
  },
  accessories: {
    emoji: "📱",
    circleClass: "bg-sky-50 ring-sky-100",
    cardClass: "from-sky-50/80 to-white",
    iconClass: "text-sky-600",
  },
  "small-appliances": {
    emoji: "🍳",
    circleClass: "bg-orange-50 ring-orange-100",
    cardClass: "from-orange-50/80 to-white",
    iconClass: "text-orange-600",
  },
};

const DEFAULT_THEME: CategoryTheme = {
  emoji: "🏪",
  circleClass: "bg-gray-50 ring-gray-100",
  cardClass: "from-gray-50/80 to-white",
  iconClass: "text-gray-600",
};

export function getCategoryTheme(slug: string): CategoryTheme {
  return CATEGORY_THEMES[slug] ?? DEFAULT_THEME;
}
