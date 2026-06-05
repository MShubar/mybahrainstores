import { useEffect } from "react";
import { useLogClientError } from "../hooks/use-log-client-error";

export function ClientErrorReporter() {
  const logClientError = useLogClientError();

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      void logClientError(event.message, {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason);

      void logClientError(message, {
        source: "unhandledrejection",
        stack:
          event.reason instanceof Error ? event.reason.stack : undefined,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [logClientError]);

  return null;
}
