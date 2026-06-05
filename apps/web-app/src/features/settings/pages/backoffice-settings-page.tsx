import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export function BackofficeSettingsPage() {
  const settings = useQuery(api.settings.queries.listGrouped);
  const updateSetting = useMutation(api.settings.mutations.updateSetting);

  const [editingId, setEditingId] = useState<Id<"settings"> | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  if (settings === undefined) {
    return <div>Loading settings...</div>;
  }

  function startEdit(setting: any) {
    setEditingId(setting._id);
    setValue(
      typeof setting.value === "object"
        ? JSON.stringify(setting.value, null, 2)
        : String(setting.value)
    );
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!settings) {
      return;
    }

    const setting = Object.values(settings)
      .flat()
      .find((item) => item._id === editingId);

    if (!setting) return;

    try {
      let parsedValue: unknown = value;

      if (setting.type === "number") {
        parsedValue = Number(value);
      }

      if (setting.type === "boolean") {
        parsedValue = value === "true";
      }

      if (setting.type === "json" || setting.type === "array") {
        parsedValue = JSON.parse(value);
      }

      await updateSetting({
        settingId: setting._id,
        value: parsedValue,
      });

      setEditingId(null);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update setting");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-gray-600">
          Control app behavior without hardcoded values.
        </p>
      </div>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Key</th>
              <th className="p-3">Group</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Public</th>
              <th className="p-3">Editable</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
          {Object.entries(settings).map(([group, groupSettings]) => (
  <section key={group} className="space-y-4">
    <h2 className="text-xl font-bold capitalize">{group}</h2>

    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full text-left text-sm">
        <tbody>
          {groupSettings.map((setting) => (
            <tr key={setting._id} className="border-b">
              <td className="p-3">
                <div className="font-medium">{setting.label}</div>
                <div className="text-xs text-gray-500">{setting.key}</div>
              </td>

              <td className="p-3">{setting.type}</td>

              <td className="max-w-xs truncate p-3 text-gray-600">
                {typeof setting.value === "object"
                  ? JSON.stringify(setting.value)
                  : String(setting.value)}
              </td>

              <td className="p-3 text-right">
                <button
                  disabled={!setting.isEditable}
                  className="rounded border px-3 py-1 disabled:opacity-40"
                  onClick={() => startEdit(setting)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <form
          onSubmit={onSubmit}
          className="rounded-xl border bg-white p-5"
        >
          <h2 className="text-xl font-bold">Edit Setting</h2>

          <textarea
            className="mt-4 min-h-32 w-full rounded border p-3 font-mono text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="mt-4 flex gap-2">
            <button className="rounded bg-black px-4 py-2 text-white">
              Save
            </button>

            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setValue("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}