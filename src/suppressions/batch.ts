import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type {
  BatchAddSuppressionsOptions,
  BatchAddSuppressionsResponse,
  BatchRemoveSuppressionsOptions,
  BatchRemoveSuppressionsResponse,
} from "./types.js";

export class SuppressionBatch {
  constructor(private readonly client: Dugble) {}

  add(
    payload: BatchAddSuppressionsOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BatchAddSuppressionsResponse>> {
    return this.client.post<BatchAddSuppressionsResponse>(
      "/suppressions/batch/add",
      payload,
      options,
    );
  }

  remove(
    payload: BatchRemoveSuppressionsOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<BatchRemoveSuppressionsResponse>> {
    return this.client.post<BatchRemoveSuppressionsResponse>(
      "/suppressions/batch/remove",
      payload,
      options,
    );
  }
}
