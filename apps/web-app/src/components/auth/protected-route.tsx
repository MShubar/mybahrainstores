import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { UserRole } from "@my-bahrain/types";

type Role = UserRole;

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = useQuery(api.users.queries.me);

  if (user === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}