import { useState } from "react";
import { useFileUpload } from "../hooks/use-file-upload";

type Props = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  entityType?: string;
  entityId?: string;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  entityType,
  entityId,
}: Props) {
  const { uploadFile } = useFileUpload();
  const [loading, setLoading] = useState(false);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const url = await uploadFile(file, entityType, entityId);
      onChange(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {value && (
        <img
          src={value}
          alt={label}
          className="h-32 w-full rounded object-cover"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={loading}
      />

      {loading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}