import { version } from "../package.json";
import { Broadcasts } from "./broadcasts/broadcasts.js";
import { Campaigns } from "./campaigns/campaigns.js";
import { ContactProperties } from "./contact-properties/contact-properties.js";
import { Contacts } from "./contacts/contacts.js";
import { Domains } from "./domains/domains.js";
import { Emails } from "./emails/emails.js";
import type {
  DugbleErrorResponse,
  DugbleResponse,
  ErrorEnvelope,
  IdempotentRequestOptions,
  RequestOptions,
  SuccessEnvelope,
} from "./interfaces.js";
import { Segments } from "./segments/segments.js";
import { SenderIds } from "./sender-ids/sender-ids.js";
import { Sms } from "./sms/sms.js";
import { Suppressions } from "./suppressions/suppressions.js";
import { Templates } from "./templates/templates.js";
import { Topics } from "./topics/topics.js";

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
  readonly sms: Sms;
  readonly domains: Domains;
  readonly senderIds: SenderIds;
  readonly contacts: Contacts;
  readonly contactProperties: ContactProperties;
  readonly topics: Topics;
  readonly segments: Segments;
  readonly suppressions: Suppressions;
  readonly broadcasts: Broadcasts;
  readonly campaigns: Campaigns;
  readonly templates: Templates;

  readonly #apiKey: string;

  constructor(apiKey: string, options: DugbleOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      throw new TypeError(
        'Missing API key. Pass it to the constructor: new Dugble("dgb_team_...")',
      );
    }

    this.#apiKey = apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    this.emails = new Emails(this);
    this.sms = new Sms(this);
    this.domains = new Domains(this);
    this.senderIds = new SenderIds(this);
    this.contacts = new Contacts(this);
    this.contactProperties = new ContactProperties(this);
    this.topics = new Topics(this);
    this.segments = new Segments(this);
    this.suppressions = new Suppressions(this);
    this.broadcasts = new Broadcasts(this);
    this.campaigns = new Campaigns(this);
    this.templates = new Templates(this);
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
    options: RequestOptions = {},
  ): Promise<DugbleResponse<T>> {
    const requestInit: RequestInit = {
      ...options,
      method: "POST",
    };

    if (body !== undefined) {
      requestInit.body = this.serializeBody(body);
    }

    return this.request<T>(path, requestInit);
  }

  async idempotentPost<T>(
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
    const key =
      idempotencyKey ??
      headers.get("Idempotency-Key") ??
      globalThis.crypto.randomUUID();

    headers.set("Idempotency-Key", key);

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
    const headers = new Headers(options.headers);

    headers.set("Authorization", `Bearer ${this.#apiKey}`);
    headers.set("Accept", "application/json");
    headers.set("User-Agent", this.userAgent);

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    } else {
      headers.delete("Content-Type");
    }

    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers,
      });
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

    let payload: SuccessEnvelope<T> | ErrorEnvelope;

    try {
      payload = (await response.json()) as SuccessEnvelope<T> | ErrorEnvelope;
    } catch {
      return {
        data: null,
        error: {
          code: "INVALID_RESPONSE",
          message: "The Dugble API returned an invalid JSON response.",
          statusCode: response.status,
          ...(requestId ? { requestId } : {}),
        },
        headers: responseHeaders,
      };
    }

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
  }
}
