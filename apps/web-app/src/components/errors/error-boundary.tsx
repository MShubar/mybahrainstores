import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md rounded-xl border bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold">Something went wrong</h1>

            <p className="mt-2 text-gray-600">
              The app hit an unexpected error.
            </p>

            {this.state.message && (
              <pre className="mt-4 overflow-auto rounded bg-gray-100 p-3 text-left text-xs">
                {this.state.message}
              </pre>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded bg-black px-4 py-2 text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}