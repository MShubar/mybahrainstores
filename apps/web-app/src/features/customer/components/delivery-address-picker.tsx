import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { CustomerAddressFieldsInput } from "@my-bahrain/validators";
import { DeliveryAddressForm } from "./delivery-address-form";
import {
  deliveryAddressToFormValues,
  emptyDeliveryAddressForm,
  type DeliveryAddressRecord,
} from "../utils/delivery-address";

type PickerMode = "list" | "create" | "edit";

type DeliveryAddressPickerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DeliveryAddressPicker({ isOpen, onClose }: DeliveryAddressPickerProps) {
  const user = useQuery(api.users.queries.me);
  const addresses = useQuery(api.customerAddresses.queries.listMy);
  const defaultCity = useQuery(api.settings.queries.getValueByKey, { key: "default_city" });
  const labelOptions = useQuery(api.settings.queries.getValueByKey, {
    key: "delivery_address_labels",
  });

  const createAddress = useMutation(api.customerAddresses.mutations.create);
  const updateAddress = useMutation(api.customerAddresses.mutations.update);
  const removeAddress = useMutation(api.customerAddresses.mutations.remove);
  const setDefaultAddress = useMutation(api.customerAddresses.mutations.setDefault);

  const [mode, setMode] = useState<PickerMode>("list");
  const [editingAddress, setEditingAddress] = useState<DeliveryAddressRecord | null>(null);
  const [formValues, setFormValues] = useState<CustomerAddressFieldsInput>(
    emptyDeliveryAddressForm(),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode("list");
      setEditingAddress(null);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function openCreateForm() {
    const firstLabel =
      Array.isArray(labelOptions) && typeof labelOptions[0] === "string"
        ? labelOptions[0]
        : "Home";

    setFormValues(
      emptyDeliveryAddressForm({
        label: firstLabel,
        fullName: user?.name ?? "",
        phone: user?.phone ?? "",
        city: typeof defaultCity === "string" ? defaultCity : "",
      }),
    );
    setEditingAddress(null);
    setError("");
    setMode("create");
  }

  function openEditForm(address: DeliveryAddressRecord) {
    setFormValues(deliveryAddressToFormValues(address));
    setEditingAddress(address);
    setError("");
    setMode("edit");
  }

  async function handleSelect(addressId: Id<"customerAddresses">) {
    setLoading(true);
    setError("");

    try {
      await setDefaultAddress({ addressId });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update delivery address");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(values: CustomerAddressFieldsInput) {
    setLoading(true);
    setError("");

    try {
      await createAddress({
        ...values,
        setAsDefault: true,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save address");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(values: CustomerAddressFieldsInput) {
    if (!editingAddress) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateAddress({
        addressId: editingAddress._id as Id<"customerAddresses">,
        ...values,
      });
      setMode("list");
      setEditingAddress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update address");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(address: DeliveryAddressRecord) {
    const confirmed = confirm(`Delete "${address.label}" address?`);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await removeAddress({ addressId: address._id as Id<"customerAddresses"> });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete address");
    } finally {
      setLoading(false);
    }
  }

  const title =
    mode === "create" ? "Add delivery address" : mode === "edit" ? "Edit address" : "Deliver to";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close address picker"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-[101] flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <div>
            {mode !== "list" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("list");
                  setEditingAddress(null);
                  setError("");
                }}
                className="mb-1 text-sm font-semibold text-[#FF5A00]"
              >
                ← Back
              </button>
            ) : null}
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {mode === "list" ? (
              <p className="mt-0.5 text-sm text-gray-500">
                Choose where your orders should be delivered.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4">
          {error && mode === "list" ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {mode === "list" ? (
            <div className="space-y-3">
              {addresses === undefined ? (
                <div className="space-y-3">
                  {[0, 1].map((key) => (
                    <div key={key} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                  ))}
                </div>
              ) : addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                  <div className="text-3xl">📍</div>
                  <p className="mt-3 text-base font-bold text-gray-900">No saved addresses</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your home, work, or any delivery location in Bahrain.
                  </p>
                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-4 rounded-xl bg-[#FF5A00] px-5 py-2.5 text-sm font-bold text-white shadow-celebrity"
                  >
                    Add delivery address
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`rounded-2xl border p-4 transition ${
                      address.isDefault
                        ? "border-orange-200 bg-orange-50/40 shadow-sm"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => void handleSelect(address._id as Id<"customerAddresses">)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-gray-900">{address.label}</p>
                          {address.isDefault ? (
                            <span className="rounded-full bg-[#FF5A00] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-700">{address.fullName}</p>
                        <p className="mt-0.5 text-sm text-gray-500">{address.summary}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{address.phone}</p>
                      </button>

                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(address)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(address)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {addresses && addresses.length > 0 ? (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white py-4 text-sm font-bold text-[#FF5A00] transition hover:border-orange-200 hover:bg-orange-50/40"
                >
                  <span className="text-lg leading-none">+</span>
                  Add new address
                </button>
              ) : null}
            </div>
          ) : (
            <DeliveryAddressForm
              initialValues={formValues}
              submitLabel={mode === "create" ? "Save address" : "Update address"}
              loading={loading}
              error={error}
              onSubmit={mode === "create" ? handleCreate : handleUpdate}
              onCancel={() => {
                setMode("list");
                setEditingAddress(null);
                setError("");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
