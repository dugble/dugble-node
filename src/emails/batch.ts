import type { Dugble } from "../client.js";
import type {
  DugbleResponse,
  IdempotentRequestOptions,
} from "../interfaces.js";
import {
  type SendEmailOptions,
  type SendEmailResponse,
  serializeSendEmail,
} from "./types.js";

export class EmailBatch {
  constructor(private readonly client: Dugble) {}

  send(
    payload: SendEmailOptions[],
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendEmailResponse[]>> {
    return this.client.idempotentPost<SendEmailResponse[]>(
      "/emails/batch",
      payload.map(serializeSendEmail),
      options,
    );
  }
}
