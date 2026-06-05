/** Shared roles across apps and Convex. */
export type UserRole = "customer" | "store" | "backoffice";

export type Timestamps = {
  createdAt: number;
  updatedAt: number;
};

/** Convex document id (string at runtime on clients). */
export type DocumentId = string;
