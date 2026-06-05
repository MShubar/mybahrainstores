import type { DocumentId, Timestamps, UserRole } from "./common";

export type User = Timestamps & {
  _id: DocumentId;
  email: string;
  name?: string;
  role: UserRole;
};

export type UserProfile = Pick<User, "_id" | "email" | "name" | "role">;
