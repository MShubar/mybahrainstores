import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function BackofficeCelebritiesPage() {
  const celebrities = useQuery(api.celebrities.queries.listBackoffice);
  const products = useQuery(api.products.queries.listPublicProducts, { limit: 50 });
  const createCelebrity = useMutation(api.celebrities.mutations.createCelebrity);
  const updateCelebrity = useMutation(api.celebrities.mutations.updateCelebrity);
  const addPick = useMutation(api.celebrities.mutations.addPick);
  const removePick = useMutation(api.celebrities.mutations.removePick);

  const [selectedId, setSelectedId] = useState<Id<"celebrities"> | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const picks = useQuery(
    api.celebrities.queries.listBackofficePicks,
    selectedId ? { celebrityId: selectedId } : "skip",
  );

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setMessage(null);

    try {
      const celebrityId = await createCelebrity({
        name,
        title: title || undefined,
        bio: bio || undefined,
        avatarUrl: avatarUrl || undefined,
        isVerified: true,
      });
      setSelectedId(celebrityId);
      setName("");
      setTitle("");
      setBio("");
      setAvatarUrl("");
      setMessage("Celebrity created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create celebrity");
    }
  }

  async function handleAddPick(event: FormEvent) {
    event.preventDefault();
    if (!selectedId || !productId) {
      return;
    }

    setMessage(null);

    try {
      await addPick({
        celebrityId: selectedId,
        productId: productId as Id<"products">,
      });
      setProductId("");
      setMessage("Product added to picks.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to add pick");
    }
  }

  if (celebrities === undefined) {
    return <p>Loading celebrities...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Celebrities</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage celebrity profiles and their curated product picks.
        </p>
      </div>

      {message ? <p className="text-sm text-gray-700">{message}</p> : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4 rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Create celebrity</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Bio"
              rows={3}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Avatar URL"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
            />
            <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
              Create
            </button>
          </form>
        </section>

        <section className="space-y-4 rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Celebrities</h2>
          <ul className="space-y-2">
            {celebrities.map((celebrity) => (
              <li
                key={celebrity._id}
                className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
                  selectedId === celebrity._id ? "border-black" : "border-gray-200"
                }`}
              >
                <button type="button" onClick={() => setSelectedId(celebrity._id)}>
                  {celebrity.name}
                </button>
                <button
                  type="button"
                  className="text-xs underline"
                  onClick={() =>
                    updateCelebrity({
                      celebrityId: celebrity._id,
                      isActive: !celebrity.isActive,
                    })
                  }
                >
                  {celebrity.isActive ? "Deactivate" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {selectedId ? (
        <section className="space-y-4 rounded-lg border bg-white p-4">
          <h2 className="font-semibold">Manage picks</h2>

          <form onSubmit={handleAddPick} className="flex flex-wrap gap-2">
            <select
              className="min-w-[240px] flex-1 rounded border px-3 py-2 text-sm"
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
            >
              <option value="">Select product</option>
              {(products ?? []).map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
              Add pick
            </button>
          </form>

          <ul className="space-y-2">
            {(picks ?? []).map((pick) => (
              <li
                key={pick.pickId}
                className="flex items-center justify-between rounded border px-3 py-2 text-sm"
              >
                <span>
                  {pick.product.name}{" "}
                  <span className="text-gray-500">({pick.product.categoryName})</span>
                </span>
                <button
                  type="button"
                  className="text-xs text-red-600 underline"
                  onClick={() => removePick({ pickId: pick.pickId })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
