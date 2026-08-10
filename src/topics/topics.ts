import type { Dugble } from "../client.js";
import type { DugbleResponse, RequestOptions } from "../interfaces.js";
import {
  type CreateTopicOptions,
  type ListTopicsOptions,
  serializeCreateTopic,
  serializeUpdateTopic,
  type Topic,
  type TopicDeleteResponse,
  type TopicList,
  type TopicMutationResponse,
  type UpdateTopicOptions,
} from "./types.js";

export class Topics {
  constructor(private readonly client: Dugble) {}

  create(
    payload: CreateTopicOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TopicMutationResponse>> {
    return this.client.post<TopicMutationResponse>(
      "/topics",
      serializeCreateTopic(payload),
      options,
    );
  }

  list(
    payload: ListTopicsOptions = {},
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TopicList>> {
    const query = new URLSearchParams();
    if (payload.limit !== undefined) query.set("limit", String(payload.limit));
    if (payload.after !== undefined) query.set("after", payload.after);
    if (payload.before !== undefined) query.set("before", payload.before);
    const suffix = query.size > 0 ? `?${query.toString()}` : "";
    return this.client.get<TopicList>(`/topics${suffix}`, options);
  }

  get(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<Topic>> {
    return this.client.get<Topic>(`/topics/${encodeURIComponent(id)}`, options);
  }

  update(
    id: string,
    payload: UpdateTopicOptions,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TopicMutationResponse>> {
    return this.client.patch<TopicMutationResponse>(
      `/topics/${encodeURIComponent(id)}`,
      serializeUpdateTopic(payload),
      options,
    );
  }

  delete(
    id: string,
    options: RequestOptions = {},
  ): Promise<DugbleResponse<TopicDeleteResponse>> {
    return this.client.delete<TopicDeleteResponse>(
      `/topics/${encodeURIComponent(id)}`,
      options,
    );
  }
}
