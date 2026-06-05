import type { DocumentId, Timestamps } from "./common";

export type Store = Timestamps & {
  _id: DocumentId;
  name: string;
  slug: string;
  ownerId: DocumentId;
  status: string;
};

export type StoreSummary = Pick<Store, "_id" | "name" | "slug" | "status">;
