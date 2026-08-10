import type { Dugble } from "../client.js";
import type {
  DugbleResponse,
  IdempotentRequestOptions,
} from "../interfaces.js";
import {
  serializeSendSms,
  type SendSmsOptions,
  type SendSmsResponse,
} from "./types.js";

export class SmsBatch {
  constructor(private readonly client: Dugble) {}

  send(
    payload: SendSmsOptions[],
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<SendSmsResponse[]>> {
    return this.client.post<SendSmsResponse[]>(
      "/sms/batch",
      payload.map(serializeSendSms),
      options,
    );
  }
}
