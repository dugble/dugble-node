export type SuppressionOrigin = "bounce" | "complaint" | "manual";

export interface Suppression {
  object: "suppression";
  id: string;
  email: string;
  origin: SuppressionOrigin;
  source_id: string | null;
  created_at: string;
}

export interface SuppressionMutationResponse {
  object: "suppression";
  id: string;
}

export interface SuppressionDeleteResponse extends SuppressionMutationResponse {
  deleted: true;
}

export interface SuppressionList {
  object: "list";
  has_more: boolean;
  data: Suppression[];
}

export interface CreateSuppressionOptions {
  email: string;
}

export interface ListSuppressionsOptions {
  limit?: number;
  after?: string;
  before?: string;
  origin?: SuppressionOrigin;
}

export interface BatchAddSuppressionsOptions {
  emails: string[];
}

export type BatchRemoveSuppressionsOptions =
  | { emails: string[]; ids?: never }
  | { ids: string[]; emails?: never };

export interface BatchAddSuppressionsResponse {
  data: SuppressionMutationResponse[];
}

export interface BatchRemoveSuppressionsResponse {
  data: SuppressionDeleteResponse[];
}
