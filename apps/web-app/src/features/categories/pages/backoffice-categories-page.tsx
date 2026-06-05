import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

const initialForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function BackofficeCategoriesPage() {
  const categories = useQuery(api.categories.queries.listBackoffice);

  const createCategory = useMutation(api.categories.mutations.createCategory);
  const updateCategory = useMutation(api.categories.mutations.updateCategory);
  const deleteCategory = useMutation(api.categories.mutations.deleteCategory);
  const toggleCategoryActive = useMutation(
    api.categories.mutations.toggleCategoryActive
  );

  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [editingId, setEditingId] = useState<Id<"categories"> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || makeSlug(form.name),
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
      };

      if (editingId) {
        await updateCategory({
          categoryId: editingId,
          ...payload,
        });
      } else {
        await createCategory(payload);
      }

      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onEdit(category: any) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      imageUrl: category.imageUrl ?? "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
  }

  async function onDelete(categoryId: Id<"categories">) {
    const confirmed = confirm("Delete this category?");

    if (!confirmed) return;

    await deleteCategory({ categoryId });
  }

  if (categories === undefined) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-1 text-gray-600">
          Manage store categories shown to customers.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border bg-white p-5 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-semibold">
          {editingId ? "Edit Category" : "Create Category"}
        </h2>

        {error && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border p-2"
            placeholder="Name"
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

          <input
            className="rounded border p-2"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
          />

          <input
            className="rounded border p-2"
            placeholder="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sortOrder: Number(e.target.value),
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

        <div className="mt-4 flex gap-2">
          <button
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Category"
                : "Create Category"}
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

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Sort</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={5}>
                  No categories yet.
                </td>
              </tr>
            )}

            {categories.map((category) => (
              <tr key={category._id} className="border-b">
                <td className="p-3 font-medium">{category.name}</td>
                <td className="p-3 text-gray-600">{category.slug}</td>
                <td className="p-3">{category.sortOrder}</td>
                <td className="p-3">
                  <button
                    className={`rounded px-3 py-1 text-xs ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      toggleCategoryActive({
                        categoryId: category._id,
                        isActive: !category.isActive,
                      })
                    }
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="space-x-2 p-3 text-right">
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() => onEdit(category)}
                  >
                    Edit
                  </button>

                  <button
                    className="rounded border border-red-300 px-3 py-1 text-red-600"
                    onClick={() => onDelete(category._id)}
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