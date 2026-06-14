import type { UserRole } from "@my-bahrain/types";

export function homeForRole(role: UserRole): string {
  if (role === "backoffice") {
    return "/backoffice";
  }

  if (role === "store") {
    return "/store";
  }

  return "/customer";
}
