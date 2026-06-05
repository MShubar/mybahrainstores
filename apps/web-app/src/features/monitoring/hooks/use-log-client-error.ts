import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useLogClientError() {
  const logClientError = useMutation(api.monitoring.mutations.logClientError);

  return async (message: string, context?: unknown) => {
    try {
      await logClientError({ message, context });
    } catch {
      console.error("Failed to report client error:", message, context);
    }
  };
}
