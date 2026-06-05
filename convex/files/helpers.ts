import { ConvexError } from "convex/values";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function assertImageUpload(
  contentType: string | undefined,
  size: number | undefined,
): void {
  if (!contentType?.startsWith("image/")) {
    throw new ConvexError("Only image uploads are allowed");
  }

  if (size !== undefined && size > MAX_IMAGE_SIZE_BYTES) {
    throw new ConvexError("Image must be less than 5MB");
  }
}
