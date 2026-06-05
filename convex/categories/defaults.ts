export const DEFAULT_CATEGORIES = [
  {
    name: "Food & Restaurants",
    slug: "food-restaurants",
    description: "Restaurants, cafes, and prepared meals",
    sortOrder: 1,
  },
  {
    name: "Grocery",
    slug: "grocery",
    description: "Supermarkets and grocery delivery",
    sortOrder: 2,
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Phones, accessories, and electronics",
    sortOrder: 3,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories",
    sortOrder: 4,
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Pharmacy, cosmetics, and personal care",
    sortOrder: 5,
  },
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
