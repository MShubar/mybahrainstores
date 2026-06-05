import { Link } from "react-router-dom";
import { useCart } from "../cart-store";

export function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cart</h1>
        <p className="mt-1 text-gray-600">Review your selected products.</p>
      </div>

      {items.length === 0 && (
        <div className="rounded border bg-white p-6">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link
            to="/customer"
            className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
          >
            Browse stores
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>

                    <td className="p-3">{item.price.toFixed(3)} BHD</td>

                    <td className="p-3">
                      <input
                        type="number"
                        min={1}
                        className="w-20 rounded border p-2"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            Number(e.target.value)
                          )
                        }
                      />
                    </td>

                    <td className="p-3">
                      {(item.price * item.quantity).toFixed(3)} BHD
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded border border-red-300 px-3 py-1 text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(3)} BHD</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={clearCart}
                className="rounded border px-4 py-2"
              >
                Clear Cart
              </button>

              <Link
                to="/customer/checkout"
                className="rounded bg-black px-4 py-2 text-white"
              >
                Continue to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}