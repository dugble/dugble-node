import { version } from "../package.json";
import { Emails } from "./emails/emails.js";
import type {
  DugbleErrorResponse,
  DugbleResponse,
  ErrorEnvelope,
  IdempotentRequestOptions,
  RequestOptions,
  SuccessEnvelope,
} from "./interfaces.js";
import { SmsResource } from "./sms/sms.js";

const DEFAULT_BASE_URL = "https://api.dugble.com";
const DEFAULT_USER_AGENT = `dugble-node/${version}`;

export interface DugbleOptions {
  baseUrl?: string;
  userAgent?: string;
}

export class Dugble {
  readonly baseUrl: string;
  readonly userAgent: string;
  readonly emails: Emails;
  readonly sms: SmsResource;

  readonly #apiKey: string;

  constructor(apiKey: string, options: DugbleOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      throw new TypeError(
        'Missing API key. Pass it to the constructor: new Dugble("dug_123")',
      );
    }

    this.#apiKey = apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.emails = new Emails(this);
    this.sms = new SmsResource(this);
  }

  async get<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    path: string,
    body?: unknown,
    options: IdempotentRequestOptions = {},
  ): Promise<DugbleResponse<T>> {
    const {
      idempotencyKey,
      headers: optionHeaders,
      ...requestOptions
    } = options;

    const headers = new Headers(optionHeaders);

    if (idempotencyKey) {
      headers.set("Idempotency-Key", idempotencyKey);
    }

    const requestInit: RequestInit = {
      ...requestOptions,
      method: "POST",
      headers,
    };

    if (body !== undefined) {
      requestInit.body = this.serializeBody(body);
    }

    return this.request<T>(path, requestInit);
  }

  async patch<T>(
    path: string,
    body: unknown,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: this.serializeBody(body),
    });
  }

  async delete<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: "DELETE",
    });
  }

  private serializeBody(body: unknown): string {
    const serialized = JSON.stringify(body);

    if (serialized === undefined) {
      throw new TypeError("Request body must be JSON-serializable.");
    }

    return serialized;
  }

  private async request<T>(
    path: string,
    options: RequestInit,
  ): Promise<DugbleResponse<T>> {
    const headers = new Headers({
      Authorization: `Bearer ${this.#apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
    });

    new Headers(options.headers).forEach((value, key) => {
      headers.set(key, value);
    });

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
      });

      const responseHeaders = Object.fromEntries(response.headers.entries());
      const requestId =
        response.headers.get("x-request-id") ??
        response.headers.get("request-id") ??
        undefined;

      if (response.status === 204) {
        return {
          data: null,
          error: null,
          headers: responseHeaders,
        };
      }

      const payload = (await response.json()) as
        | SuccessEnvelope<T>
        | ErrorEnvelope;

      if (!response.ok || !payload.success) {
        const errorPayload = payload as ErrorEnvelope;

        return {
          data: null,
          error: {
            code: errorPayload.error?.code ?? "APPLICATION_ERROR",
            message:
              errorPayload.error?.message ??
              "The Dugble API could not process the request.",
            statusCode: response.status,
            ...(requestId ? { requestId } : {}),
          },
          headers: responseHeaders,
        };
      }

      return {
        data: payload.data,
        error: null,
        headers: responseHeaders,
      };
    } catch (cause) {
      const error: DugbleErrorResponse = {
        code: "NETWORK_ERROR",
        message:
          cause instanceof Error
            ? cause.message
            : "The request to the Dugble API failed.",
        statusCode: null,
      };

      return {
        data: null,
        error,
        headers: null,
      };
    }
  }
}
