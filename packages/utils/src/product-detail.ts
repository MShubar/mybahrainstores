export function mockRating(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash + seed.charCodeAt(index) * (index + 1)) % 100;
  }

  return 4 + (hash % 10) / 10;
}

export function featureBullets(description?: string, max = 6): string[] {
  if (!description) {
    return [
      "Premium build quality",
      "Official warranty included",
      "Authentic product guarantee",
    ];
  }

  const parts = description
    .split(/[.!]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts.slice(0, max);
  }

  return [
    parts[0] ?? description,
    "Carefully inspected before dispatch",
    "Secure packaging for delivery",
  ].slice(0, max);
}

export type ProductSpec = {
  label: string;
  value: string;
};

function hashPick(seed: string, options: string[]): string {
  if (options.length === 0) {
    return "";
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash + seed.charCodeAt(index) * (index + 1)) % 1000;
  }

  return options[hash % options.length]!;
}

export function productDetailSpecs(params: {
  categorySlug?: string | null;
  name: string;
  stockQuantity?: number | null;
}): ProductSpec[] {
  const { categorySlug, name, stockQuantity } = params;
  const stock =
    typeof stockQuantity === "number"
      ? stockQuantity > 0
        ? `${stockQuantity} units available`
        : "Limited availability"
      : "In stock";

  switch (categorySlug) {
    case "watches":
      return [
        { label: "Brand", value: name.split(" ")[0] ?? "Premium" },
        { label: "Movement", value: hashPick(name, ["Quartz", "Automatic", "Digital"]) },
        { label: "Water resistance", value: hashPick(name, ["50m", "100m", "200m", "Splash resistant"]) },
        { label: "Strap", value: hashPick(name, ["Leather", "Stainless steel", "Silicone", "Mesh"]) },
        { label: "Availability", value: stock },
      ];
    case "perfume":
      return [
        { label: "Volume", value: hashPick(name, ["50ml", "75ml", "100ml"]) },
        { label: "Concentration", value: hashPick(name, ["Eau de Parfum", "Eau de Toilette", "Parfum"]) },
        { label: "Gender", value: hashPick(name, ["Unisex", "Women", "Men"]) },
        { label: "Origin", value: hashPick(name, ["France", "Italy", "UAE", "Switzerland"]) },
        { label: "Availability", value: stock },
      ];
    case "makeup":
      return [
        { label: "Finish", value: hashPick(name, ["Matte", "Natural", "Glow", "Satin"]) },
        { label: "Coverage", value: hashPick(name, ["Light", "Medium", "Full"]) },
        { label: "Skin type", value: hashPick(name, ["All skin types", "Normal to dry", "Combination"]) },
        { label: "Cruelty free", value: "Yes" },
        { label: "Availability", value: stock },
      ];
    case "electronics":
      return [
        { label: "Condition", value: "Brand new" },
        { label: "Warranty", value: hashPick(name, ["1 year", "2 years", "6 months"]) },
        { label: "Connectivity", value: hashPick(name, ["Bluetooth", "Wi‑Fi", "USB‑C", "Wireless"]) },
        { label: "Box contents", value: "Device, cable, manual" },
        { label: "Availability", value: stock },
      ];
    case "accessories":
      return [
        { label: "Compatibility", value: hashPick(name, ["Universal", "iPhone", "Android", "USB-C"]) },
        { label: "Material", value: hashPick(name, ["Silicone", "TPU", "Metal", "Braided nylon"]) },
        { label: "Color", value: hashPick(name, ["Black", "Clear", "Navy", "Rose gold"]) },
        { label: "Availability", value: stock },
      ];
    case "small-appliances":
      return [
        { label: "Power", value: hashPick(name, ["600W", "800W", "1000W", "1200W"]) },
        { label: "Capacity", value: hashPick(name, ["1L", "1.5L", "4L", "1.7L"]) },
        { label: "Warranty", value: hashPick(name, ["1 year", "2 years", "6 months"]) },
        { label: "Availability", value: stock },
      ];
    default:
      return [
        { label: "Condition", value: "Brand new" },
        { label: "Authenticity", value: "100% genuine" },
        { label: "Availability", value: stock },
      ];
  }
}

export function productDetailHighlights(categorySlug?: string | null): string[] {
  switch (categorySlug) {
    case "watches":
      return [
        "Precision timekeeping with premium finishing",
        "Suitable for daily wear and special occasions",
        "Includes official packaging",
      ];
    case "perfume":
      return [
        "Long-lasting scent profile",
        "Ideal for gifting",
        "Sealed original bottle",
      ];
    case "makeup":
      return [
        "Dermatologically tested formulas",
        "Buildable, everyday wear",
        "Trusted beauty brands",
      ];
    case "electronics":
      return [
        "Latest features and reliable performance",
        "Compatible with popular devices",
        "Original manufacturer warranty",
      ];
    case "accessories":
      return [
        "Protects your phone during everyday use",
        "Compatible with popular device models",
        "Essential add-ons for mobile setups",
      ];
    case "small-appliances":
      return [
        "Compact designs for modern kitchens",
        "Energy-efficient everyday performance",
        "Easy to use and clean",
      ];
    default:
      return [
        "Curated for quality and value",
        "Fast delivery across Bahrain",
        "Secure checkout",
      ];
  }
}
