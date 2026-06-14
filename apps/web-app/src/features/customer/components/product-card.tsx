import { useRef } from "react";
import { Link } from "react-router-dom";
import { extractBrandFromProductName } from "@my-bahrain/utils";
import { useFlyToCart } from "../../cart/fly-to-cart";
import { discountPercent, formatPrice } from "../../../lib/format-price";
import { ProductImage } from "./product-image";

type ProductCardProps = {
  productId: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  variant?: "list" | "grid";
  onAddToCart?: () => void;
};

function productSubtitle(name: string, brand: string): string {
  const trimmed = name.trim();
  if (trimmed.startsWith(`${brand} `)) {
    return trimmed.slice(brand.length + 1);
  }
  return trimmed;
}

export function ProductCard({
  productId,
  name,
  price,
  compareAtPrice,
  imageUrl,
  variant = "list",
  onAddToCart,
}: ProductCardProps) {
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const { flyToCartFromElement } = useFlyToCart();
  const discount = discountPercent(price, compareAtPrice);
  const brand = extractBrandFromProductName(name);
  const subtitle = productSubtitle(name, brand);

  function handleAddToCartClick() {
    if (!onAddToCart) {
      return;
    }

    flyToCartFromElement(addToCartRef, { imageUrl, name, price });
    onAddToCart();
  }

  if (variant === "grid") {
    return (
      <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card transition hover:border-orange-100 hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
          <Link to={`/customer/products/${productId}`} className="block h-full w-full">
            <ProductImage src={imageUrl} alt={name} className="h-full w-full object-cover" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <Link
            to={`/customer/products/${productId}`}
            className="flex flex-1 flex-col gap-1.5 transition active:scale-[0.99]"
          >
            <p className="line-clamp-1 text-sm font-bold text-gray-900">{brand}</p>
            <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-snug text-gray-600">{subtitle}</p>

            <div className="mt-auto flex items-end justify-between gap-2 pt-1">
              <div className="min-w-0">
                {compareAtPrice && compareAtPrice > price ? (
                  <p className="text-xs font-medium text-red-500 line-through">
                    {formatPrice(compareAtPrice)}
                  </p>
                ) : null}
                <p className="text-sm font-bold text-gray-900">{formatPrice(price)}</p>
              </div>

              {discount ? (
                <span className="flex-shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                  {discount}%
                </span>
              ) : null}
            </div>
          </Link>

          {onAddToCart ? (
            <button
              ref={addToCartRef}
              type="button"
              onClick={handleAddToCartClick}
              className="mt-2 w-full rounded-lg bg-black py-2 text-xs font-bold text-white transition hover:bg-gray-900 active:scale-[0.98]"
            >
              Buy now
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/customer/products/${productId}`}
      className="flex gap-3.5 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-card transition active:scale-[0.99] hover:border-orange-100 hover:shadow-md"
    >
      <div className="flex h-[92px] w-[92px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F3F4F6]">
        <ProductImage src={imageUrl} alt={name} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-0.5">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900">
          {name}
        </p>

        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-base font-bold text-gray-900">{formatPrice(price)}</p>
          {compareAtPrice && compareAtPrice > price ? (
            <p className="text-xs text-gray-400 line-through">{formatPrice(compareAtPrice)}</p>
          ) : null}
        </div>

        {discount ? (
          <span className="inline-flex w-fit rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-green-100">
            {discount}% off with PRO12
          </span>
        ) : null}

        <p className="flex items-center gap-1 text-xs font-medium text-gray-500">
          <svg className="h-3.5 w-3.5 text-[#FF5A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          Free delivery
        </p>
      </div>
    </Link>
  );
}
