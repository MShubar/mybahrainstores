import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { requireEnv } from "@my-bahrain/config";
import { CartProvider } from "./features/cart/cart-store";
import App from "./app";
import "./index.css";
import { ErrorBoundaryWithLogging } from "./components/errors/error-boundary-with-logging";
import { ClientErrorReporter } from "./features/monitoring/components/client-error-reporter";

const convex = new ConvexReactClient(
  requireEnv("VITE_CONVEX_URL", import.meta.env.VITE_CONVEX_URL),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <ClientErrorReporter />
      <ErrorBoundaryWithLogging>
        <CartProvider>
          <App />
        </CartProvider>
      </ErrorBoundaryWithLogging>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
