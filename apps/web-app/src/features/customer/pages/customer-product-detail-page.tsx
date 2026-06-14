import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import {
  extractBrandFromProductName,
  featureBullets,
  mockRating,
  productDetailHighlights,
  productDetailSpecs,
} from "@my-bahrain/utils";
import { useCart } from "../../cart/cart-store";
import { useFlyToCart } from "../../cart/fly-to-cart";
import { discountPercent, formatPrice } from "../../../lib/format-price";
import { CartButton } from "../components/customer-home-header";
import { BackButton } from "../components/page-header";

export function CustomerProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { flyToCartFromElement } = useFlyToCart();
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = useQuery(
    api.products.queries.getById,
    productId ? { productId: productId as Id<"products"> } : "skip",
  );

  if (product === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-3 px-4 py-12 text-center">
        <p className="text-gray-600">Product not found.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="font-semibold text-[#FF5A00]"
        >
          Go back
        </button>
      </div>
    );
  }

  const productData = product;
  const brand = extractBrandFromProductName(product.name);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const rating = mockRating(product._id);
  const features = featureBullets(product.description);
  const highlights = productDetailHighlights(product.categorySlug);
  const specs = productDetailSpecs({
    categorySlug: product.categorySlug,
    name: product.name,
    stockQuantity: product.stockQuantity,
  });
  const imageUrls = product.imageUrls.length > 0 ? product.imageUrls : [];
  const activeImageUrl = imageUrls[selectedImageIndex];

  function handleAddToCart() {
    flyToCartFromElement(addToCartRef, {
      imageUrl: productData.imageUrls[0],
      name: productData.name,
      price: productData.price,
    });

    for (let index = 0; index < quantity; index += 1) {
      addItem({
        productId: productData._id,
        storeId: productData.storeId,
        name: productData.name,
        price: productData.price,
        imageUrl: productData.imageUrls[0],
      });
    }
  }

  return (
    <div className="pb-28">
      <div className="relative w-full overflow-hidden bg-[#E5E7EB]">
        <div className="aspect-square max-h-[420px] w-full">
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#F3F4F6] text-5xl">
              ⌚
            </div>
          )}
        </div>

        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
          <BackButton onClick={() => navigate(-1)} light />
          <CartButton className="bg-white/95 text-gray-800 shadow-md backdrop-blur transition hover:bg-white" />
        </div>
      </div>

      {imageUrls.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                selectedImageIndex === index ? "border-[#FF5A00]" : "border-transparent"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="space-y-4 px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#FF5A00] ring-1 ring-orange-100">
            {brand}
          </span>
          {product.categoryName ? (
            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {product.categoryName}
            </span>
          ) : null}
        </div>

        <h1 className="text-2xl font-bold leading-tight text-gray-900">{product.name}</h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
            <svg className="h-4 w-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
          </div>
          {discount ? (
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
              {discount}% off
            </span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {product.stockQuantity && product.stockQuantity > 0 ? "In stock" : "Limited stock"}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-[28px] font-extrabold text-gray-900">{formatPrice(product.price)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <p className="text-base text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        {discount && product.compareAtPrice ? (
          <p className="text-sm font-semibold text-green-700">
            You save {formatPrice(product.compareAtPrice - product.price)}
          </p>
        ) : null}

        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF5A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <p className="font-bold text-gray-900">Free delivery</p>
              <p className="text-sm text-gray-500">Delivered to your address in Bahrain</p>
            </div>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF5A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="font-bold text-gray-900">Authentic product</p>
              <p className="text-sm text-gray-500">100% genuine items from trusted sellers</p>
            </div>
          </div>
        </div>

        {product.description ? (
          <div className="rounded-2xl bg-brand-surface p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">
              About this product
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{product.description}</p>
          </div>
        ) : null}

        <div>
          <h2 className="text-base font-bold text-gray-900">Key features</h2>
          <ul className="mt-3 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF5A00]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900">Product specifications</h2>
          <dl className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            {specs.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  index < specs.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <dt className="text-sm text-gray-500">{spec.label}</dt>
                <dd className="text-right text-sm font-semibold text-gray-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900">Why you&apos;ll love it</h2>
          <ul className="mt-3 space-y-2.5">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5 text-sm text-gray-600">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#FF5A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {product.storeName ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">Sold by</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-[#FF5A00]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">{product.storeName}</p>
                <p className="text-sm text-gray-500">Verified seller on Bahrain Store</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="px-3.5 py-2.5 text-lg font-bold text-gray-700 transition hover:bg-gray-50"
            >
              −
            </button>
            <span className="min-w-8 text-center text-base font-bold text-gray-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="px-3.5 py-2.5 text-lg font-bold text-gray-700 transition hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <button
            ref={addToCartRef}
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-black py-3.5 text-base font-bold text-white shadow-celebrity transition hover:bg-gray-900 active:scale-[0.99]"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
