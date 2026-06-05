import type { DocumentId, Timestamps } from "./common";

export type Product = Timestamps & {
  _id: DocumentId;
  storeId: DocumentId;
  categoryId?: DocumentId;
  name: string;
  slug: string;
  price: number;
  currency: string;
  isActive: boolean;
};

export type Category = Timestamps & {
  _id: DocumentId;
  name: string;
  slug: string;
  storeId?: DocumentId;
};
