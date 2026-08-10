const DEFAULT_BASE_URL = "https://api.dugble.com";

export interface DugbleOptions {
  /**
   * Override the Dugble API URL.
   *
   * Useful for local development and testing.
   */
  baseUrl?: string;
}

export class Dugble {
  readonly baseUrl: string;

  readonly #apiKey: string;

  constructor(apiKey: string, options: DugbleOptions = {}) {
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      throw new TypeError(
        'Missing API key. Pass it to the constructor: new Dugble("dug_123")',
      );
    }

    this.#apiKey = apiKey.trim();
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  }

  /**
   * Returns the authorization headers used for Dugble API requests.
   */
  protected getHeaders(): Headers {
    return new Headers({
      Authorization: `Bearer ${this.#apiKey}`,
      "Content-Type": "application/json",
    });
  }
}
