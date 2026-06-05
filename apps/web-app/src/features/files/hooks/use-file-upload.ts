import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function useFileUpload() {
  const generateUploadUrl = useMutation(api.files.mutations.generateUploadUrl);
  const saveUploadedFile = useMutation(api.files.mutations.saveUploadedFile);

  async function uploadFile(file: File, entityType?: string, entityId?: string) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image uploads are allowed");
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error("Image must be less than 5MB");
    }

    const uploadUrl = await generateUploadUrl();

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!result.ok) {
      throw new Error("Upload failed");
    }

    const json = await result.json();

    const savedFile = await saveUploadedFile({
      storageId: json.storageId,
      entityType,
      entityId,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    });

    return savedFile.url;
  }

  return { uploadFile };
}
