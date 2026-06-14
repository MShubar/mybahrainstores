import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { DeliveryAddressPicker } from "./delivery-address-picker";

export function AccountDeliverySection() {
  const defaultAddress = useQuery(api.customerAddresses.queries.getDefault);
  const [pickerOpen, setPickerOpen] = useState(false);

  const deliveryLabel =
    defaultAddress === undefined ? "Loading..." : defaultAddress?.label ?? "Add address";
  const deliveryHint =
    defaultAddress === undefined
      ? "Fetching saved addresses"
      : defaultAddress?.summary ?? "Choose where you want orders delivered";

  return (
    <>
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-card transition hover:border-orange-100 hover:shadow-md"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#FF5A00]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500">Deliver to</p>
          <p className="truncate text-base font-bold text-gray-900">{deliveryLabel}</p>
          <p className="truncate text-sm text-gray-500">{deliveryHint}</p>
        </div>

        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <DeliveryAddressPicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
}
