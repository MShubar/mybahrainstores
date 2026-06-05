import type { DocumentId, Timestamps } from "./common";

export type Payment = Timestamps & {
  _id: DocumentId;
  orderId: DocumentId;
  provider: string;
  externalId: string;
  amount: number;
  currency: string;
  status: string;
};
