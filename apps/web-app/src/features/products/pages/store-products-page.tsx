import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ImageUploadField } from "../../files/components/image-upload-field";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";
type ProductForm = {
  categoryId: Id<"categories"> | "";
  name: string;
  slug: string;
  description: string;
  imageUrls: string;
  price: number;
  compareAtPrice: number | "";
  stockQuantity: number | "";
  isAvailable: boolean;
  isActive: boolean;
};

const initialForm: ProductForm = {
  categoryId: "",
  name: "",
  slug: "",
  description: "",
  imageUrls: "",
  price: 0,
  compareAtPrice: "",
  stockQuantity: "",
  isAvailable: true,
  isActive: true,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseImageUrls(value: string) {
  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export function StoreProductsPage() {
  const myStore = useQuery(api.stores.queries.getMyStore);
  const categories = useQuery(api.categories.queries.listPublic);

  const products = useQuery(
    api.products.queries.listMyStoreProducts,
    myStore ? { storeId: myStore._id } : "skip"
  );

  const createProduct = useMutation(api.products.mutations.createProduct);
  const trackEvent = useTrackEvent();
  const updateProduct = useMutation(api.products.mutations.updateProduct);
  const deleteProduct = useMutation(api.products.mutations.deleteProduct);
  const toggleAvailable = useMutation(
    api.products.mutations.toggleProductAvailable
  );
  const toggleActive = useMutation(api.products.mutations.toggleProductActive);

  const [form, setForm] = useState<ProductForm>(initialForm);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!myStore) {
      setError("Create your store profile first.");
      return;
    }

    if (!form.categoryId) {
      setError("Select a category.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        categoryId: form.categoryId,
        name: form.name,
        slug: form.slug || makeSlug(form.name),
        description: form.description || undefined,
        imageUrls: parseImageUrls(form.imageUrls),
        price: Number(form.price),
        compareAtPrice:
          form.compareAtPrice === "" ? undefined : Number(form.compareAtPrice),
        stockQuantity:
          form.stockQuantity === "" ? undefined : Number(form.stockQuantity),
        isAvailable: form.isAvailable,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateProduct({
          productId: editingId,
          ...payload,
        });
      } else {
        const productId = await createProduct({
          storeId: myStore._id,
          ...payload,
        });
        await trackEvent("product_created", "product", productId);
      }

      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  function onEdit(product: any) {
    setEditingId(product._id);
    setForm({
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      imageUrls: product.imageUrls.join("\n"),
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? "",
      stockQuantity: product.stockQuantity ?? "",
      isAvailable: product.isAvailable,
      isActive: product.isActive,
    });
  }

  async function onDelete(productId: Id<"products">) {
    const confirmed = confirm("Delete this product?");
    if (!confirmed) return;

    await deleteProduct({ productId });
  }

  if (
    myStore === undefined ||
    categories === undefined ||
    products === undefined
  ) {
    return <div>Loading products...</div>;
  }

  if (!myStore) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-gray-600">
          Create your store profile first before adding products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-1 text-gray-600">
          Add and manage products for {myStore.name}.
        </p>
      </div>

      {!myStore.isApproved && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
          Your store is still pending approval. You can add products, but they
          will not be public until approval.
        </div>
      )}

      <form onSubmit={onSubmit} className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId ? "Edit Product" : "Create Product"}
        </h2>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="Product name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: makeSlug(e.target.value),
              }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, slug: e.target.value }))
            }
          />

          <select
            className="rounded border p-2"
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoryId: e.target.value as Id<"categories">,
              }))
            }
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            className="rounded border p-2"
            placeholder="Price"
            type="number"
            step="0.001"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Compare at price"
            type="number"
            step="0.001"
            value={form.compareAtPrice}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                compareAtPrice:
                  e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Stock quantity"
            type="number"
            value={form.stockQuantity}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                stockQuantity:
                  e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
          />

          <textarea
            className="rounded border p-2 md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />

<ImageUploadField
  label="Product Image"
  value={form.imageUrls.split("\n").filter(Boolean)[0]}
  entityType="product"
  entityId={editingId ?? undefined}
  onChange={(url) =>
    setForm((prev) => ({
      ...prev,
      imageUrls: url,
    }))
  }
/>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                }))
              }
            />
            Available
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            Active
          </label>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Create Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Available</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={6}>
                  No products yet.
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.slug}</div>
                </td>

                <td className="p-3">{product.price.toFixed(3)} BHD</td>
                <td className="p-3">{product.stockQuantity ?? "N/A"}</td>

                <td className="p-3">
                  <button
                    className={`rounded px-2 py-1 text-xs ${
                      product.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      toggleAvailable({
                        productId: product._id,
                        isAvailable: !product.isAvailable,
                      })
                    }
                  >
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>

                <td className="p-3">
                  <button
                    className={`rounded px-2 py-1 text-xs ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      toggleActive({
                        productId: product._id,
                        isActive: !product.isActive,
                      })
                    }
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="space-x-2 p-3 text-right">
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="rounded border border-red-300 px-3 py-1 text-red-600"
                    onClick={() => onDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}