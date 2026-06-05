import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { requireEnv } from "@my-bahrain/config";
import App from "./app";
import "./index.css";

const convex = new ConvexReactClient(
  requireEnv("VITE_CONVEX_URL", import.meta.env.VITE_CONVEX_URL),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);
