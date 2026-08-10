import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type CreateSenderIdOptions,
  type SenderId,
  serializeCreateSenderId,
} from "./types.js";

export class SenderIds {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateSenderIdOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SenderId>> {
    return this.client.post<SenderId>(
      "/sender-ids",
      serializeCreateSenderId(payload),
      options,
    );
  }

  list(options: RequestOptions = {}): Promise<DugbleResponse<SenderId[]>> {
    return this.client.get<SenderId[]>("/sender-ids", options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SenderId>> {
    return this.client.get<SenderId>(
      `/sender-ids/${encodeURIComponent(id)}`,
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SenderId>> {
    return this.client.delete<SenderId>(
      `/sender-ids/${encodeURIComponent(id)}`,
      options,
    );
  }
}
