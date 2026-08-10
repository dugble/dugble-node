import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import type {
  CreateSegmentOptions,
  ListSegmentContactsOptions,
  ListSegmentsOptions,
  Segment,
  SegmentContact,
} from "./types.js";

export class Segments {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateSegmentOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Segment>> {
    return this.client.post<Segment>("/segments", payload, options);
  }

  list(
    payload: ListSegmentsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Segment[]>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.offset !== undefined) query.set("offset", String(payload.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<Segment[]>(`/segments${suffix}`, options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Segment>> {
    return this.client.get<Segment>(`/segments/${encodeURIComponent(id)}`, options);
  }

  contacts(
    id: string,
    payload: ListSegmentContactsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<SegmentContact[]>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.offset !== undefined) query.set("offset", String(payload.offset));
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<SegmentContact[]>(
      `/segments/${encodeURIComponent(id)}/contacts${suffix}`,
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Segment>> {
    return this.client.delete<Segment>(
      `/segments/${encodeURIComponent(id)}`,
      options,
    );
  }
}
