import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "@convex/_generated/api";
import { useCart } from "../../cart/cart-store";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const createOrder = useMutation(api.orders.mutations.createOrder);
  const trackEvent = useTrackEvent();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Manama");
  const [area, setArea] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Cart is empty.");
      return;
    }

    const firstItem = items[0];
    if (!firstItem) {
      setError("Cart is empty.");
      return;
    }

    const storeId = firstItem.storeId;
    const hasMultipleStores = items.some((item) => item.storeId !== storeId);

    if (hasMultipleStores) {
      setError("Orders from multiple stores are not supported yet.");
      return;
    }

    setLoading(true);

    try {
      const orderId = await createOrder({
        storeId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          fullName,
          phone,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          city,
          area: area || undefined,
        },
        customerNotes: customerNotes || undefined,
      });

      await trackEvent("order_created", "order", orderId, { storeId });

      clearCart();
      navigate(`/customer/orders/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-2 text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form onSubmit={onSubmit} className="rounded-xl border bg-white p-5">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-1 text-gray-600">Enter your delivery information.</p>

        {error && (
          <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            className="rounded border p-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            className="rounded border p-2 md:col-span-2"
            placeholder="Address line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            required
          />

          <input
            className="rounded border p-2 md:col-span-2"
            placeholder="Address line 2"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />

          <input
            className="rounded border p-2"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <input
            className="rounded border p-2"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <textarea
            className="rounded border p-2 md:col-span-2"
            placeholder="Notes for the store"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="mt-5 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>

      <aside className="rounded-xl border bg-white p-5">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(3)} BHD</span>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(3)} BHD</span>
          </div>

          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Delivery fee</span>
            <span>Calculated at order</span>
          </div>

          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{subtotal.toFixed(3)}+ BHD</span>
          </div>
        </div>
      </aside>
    </div>
  );
}