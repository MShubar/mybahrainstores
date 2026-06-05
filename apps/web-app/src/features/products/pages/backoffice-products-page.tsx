import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export function BackofficeProductsPage() {
  const products = useQuery(api.products.queries.listBackofficeProducts);

  if (products === undefined) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-1 text-gray-600">Read-only catalog overview.</p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Store</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.price.toFixed(3)} BHD</td>
                <td className="p-3 text-xs text-gray-500">{product.storeId}</td>
                <td className="p-3">
                  {product.isActive && product.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
