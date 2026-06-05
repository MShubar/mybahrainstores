import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function useTrackEvent() {
  const trackEvent = useMutation(api.analytics.mutations.trackEvent);

  return async (
    event: string,
    entityType?: string,
    entityId?: string,
    metadata?: unknown,
  ) => {
    await trackEvent({
      event,
      entityType,
      entityId,
      metadata,
    });
  };
}
