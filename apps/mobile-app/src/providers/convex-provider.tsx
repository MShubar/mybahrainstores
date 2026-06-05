import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string,
);

export function AppConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
  );
}
