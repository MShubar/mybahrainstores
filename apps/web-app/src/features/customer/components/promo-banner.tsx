import { Link } from "react-router-dom";

export function PromoBanner() {
  return (
    <div className="mx-4 flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">Special Deals Just for You!</h3>
        <p className="mt-1 text-sm text-gray-600">Up to 30% off on selected items</p>
        <Link
          to="/customer/products"
          className="mt-3 inline-block rounded-lg bg-[#FF5A00] px-4 py-2 text-sm font-bold text-white"
        >
          Shop Now
        </Link>
      </div>
      <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full bg-[#FF5A00] text-white">
        <span className="text-lg font-extrabold leading-none">30%</span>
        <span className="text-[10px] font-bold">OFF</span>
      </div>
    </div>
  );
}
