export interface DugbleErrorResponse {
  code: string;
  message: string;
  statusCode: number | null;
  requestId?: string;
}

export interface DugbleResponse<T> {
  data: T | null;
  error: DugbleErrorResponse | null;
  headers: Record<string, string> | null;
}

export interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface IdempotentRequestOptions extends RequestOptions {
  idempotencyKey?: string;
}

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

export interface ErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
