import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../cart/cart-store";
import { useFlyToCart } from "../../cart/fly-to-cart";
import { AppBrandTitle } from "./app-brand-title";

export function CartButton({ className = "" }: { className?: string }) {
  const { totalItems } = useCart();
  const { registerCartTarget } = useFlyToCart();
  const targetRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    registerCartTarget(targetRef);

    return () => {
      registerCartTarget(null);
    };
  }, [registerCartTarget]);

  return (
    <Link
      ref={targetRef}
      to="/customer/cart"
      className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${className}`}
    >
      <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {totalItems > 0 ? (
        <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}

export function CustomerCartHeader() {
  return (
    <header className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center bg-white px-4 pb-3 pt-4">
      <div aria-hidden className="h-10 w-10" />
      <div className="flex justify-center">
        <AppBrandTitle />
      </div>
      <div className="flex justify-end">
        <CartButton />
      </div>
    </header>
  );
}

export function CustomerHomeHeader() {
  return <CustomerCartHeader />;
}
