import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { customerAddressFieldsSchema, type CustomerAddressFieldsInput } from "@my-bahrain/validators";
import { parseAddressLabelOptions } from "../utils/delivery-address";

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 focus:border-[#FF5A00] focus:outline-none focus:ring-2 focus:ring-orange-100";

function FormField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

type DeliveryAddressFormProps = {
  initialValues: CustomerAddressFieldsInput;
  submitLabel: string;
  loading?: boolean;
  error?: string;
  onSubmit: (values: CustomerAddressFieldsInput) => Promise<void>;
  onCancel: () => void;
};

export function DeliveryAddressForm({
  initialValues,
  submitLabel,
  loading = false,
  error,
  onSubmit,
  onCancel,
}: DeliveryAddressFormProps) {
  const labelOptionsSetting = useQuery(api.settings.queries.getValueByKey, {
    key: "delivery_address_labels",
  });
  const defaultCity = useQuery(api.settings.queries.getValueByKey, {
    key: "default_city",
  });

  const [values, setValues] = useState(initialValues);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (typeof defaultCity === "string" && defaultCity && !values.city) {
      setValues((current) => ({ ...current, city: defaultCity }));
    }
  }, [defaultCity, values.city]);

  const labelOptions = parseAddressLabelOptions(labelOptionsSetting);

  function updateField<K extends keyof CustomerAddressFieldsInput>(
    key: K,
    value: CustomerAddressFieldsInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFieldError("");

    const parsed = customerAddressFieldsSchema.safeParse({
      ...values,
      addressLine2: values.addressLine2?.trim() || undefined,
      area: values.area?.trim() || undefined,
    });

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Invalid address");
      return;
    }

    await onSubmit(parsed.data);
  }

  const displayError = error ?? fieldError;

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      {displayError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          {displayError}
        </div>
      ) : null}

      <FormField label="Label" id="addressLabel">
        <div className="flex flex-wrap gap-2">
          {labelOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateField("label", option)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                values.label === option
                  ? "bg-[#FF5A00] text-white shadow-celebrity"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-orange-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          id="addressLabel"
          className={`${inputClassName} mt-2`}
          placeholder="e.g. Home, Work, Parents"
          value={values.label}
          onChange={(event) => updateField("label", event.target.value)}
          required
        />
      </FormField>

      <FormField label="Full name" id="addressFullName">
        <input
          id="addressFullName"
          className={inputClassName}
          value={values.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          autoComplete="name"
        />
      </FormField>

      <FormField label="Phone" id="addressPhone">
        <input
          id="addressPhone"
          className={inputClassName}
          value={values.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          required
          autoComplete="tel"
        />
      </FormField>

      <FormField label="Address line 1" id="addressLine1">
        <input
          id="addressLine1"
          className={inputClassName}
          placeholder="Building, street"
          value={values.addressLine1}
          onChange={(event) => updateField("addressLine1", event.target.value)}
          required
          autoComplete="address-line1"
        />
      </FormField>

      <FormField label="Address line 2" id="addressLine2">
        <input
          id="addressLine2"
          className={inputClassName}
          placeholder="Flat, floor (optional)"
          value={values.addressLine2 ?? ""}
          onChange={(event) => updateField("addressLine2", event.target.value)}
          autoComplete="address-line2"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" id="addressCity">
          <input
            id="addressCity"
            className={inputClassName}
            value={values.city}
            onChange={(event) => updateField("city", event.target.value)}
            required
            autoComplete="address-level2"
          />
        </FormField>

        <FormField label="Area" id="addressArea">
          <input
            id="addressArea"
            className={inputClassName}
            placeholder="Juffair"
            value={values.area ?? ""}
            onChange={(event) => updateField("area", event.target.value)}
            autoComplete="address-level3"
          />
        </FormField>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-[#FF5A00] py-3 text-sm font-bold text-white shadow-celebrity transition hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
