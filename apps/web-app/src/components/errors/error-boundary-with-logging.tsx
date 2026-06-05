import { ReactNode } from "react";
import { ErrorBoundary } from "./error-boundary";
import { useLogClientError } from "../../features/monitoring/hooks/use-log-client-error";

type Props = {
  children: ReactNode;
};

export function ErrorBoundaryWithLogging({ children }: Props) {
  const logClientError = useLogClientError();

  return (
    <ErrorBoundary
      onError={(error, info) => {
        void logClientError(error.message, {
          source: "react_error_boundary",
          componentStack: info.componentStack,
          stack: error.stack,
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
