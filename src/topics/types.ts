export type TopicSubscription = "opt_in" | "opt_out";
export type TopicVisibility = "public" | "private";

export interface Topic {
  object: "topic";
  id: string;
  name: string;
  description: string | null;
  default_subscription: TopicSubscription;
  visibility: TopicVisibility;
  created_at: string;
}

export interface TopicMutationResponse {
  object: "topic";
  id: string;
}

export interface TopicDeleteResponse extends TopicMutationResponse {
  deleted: true;
}

export interface TopicList {
  object: "list";
  has_more: boolean;
  data: Topic[];
}

export interface CreateTopicOptions {
  name: string;
  description?: string;
  defaultSubscription: TopicSubscription;
  visibility?: TopicVisibility;
}

export interface UpdateTopicOptions {
  name?: string;
  description?: string | null;
  visibility?: TopicVisibility;
}

export interface ListTopicsOptions {
  limit?: number;
  offset?: number;
}

export interface CreateTopicRequest {
  name: string;
  description?: string;
  default_subscription: TopicSubscription;
  visibility?: TopicVisibility;
}

export interface UpdateTopicRequest {
  name?: string;
  description?: string | null;
  visibility?: TopicVisibility;
}

export function serializeCreateTopic(
  payload: CreateTopicOptions,
): CreateTopicRequest {
  const result: CreateTopicRequest = {
    name: payload.name,
    default_subscription: payload.defaultSubscription,
  };

  if (payload.description !== undefined)
    result.description = payload.description;
  if (payload.visibility !== undefined) result.visibility = payload.visibility;
  return result;
}

export function serializeUpdateTopic(
  payload: UpdateTopicOptions,
): UpdateTopicRequest {
  const result: UpdateTopicRequest = {};

  if (payload.name !== undefined) result.name = payload.name;
  if (payload.description !== undefined)
    result.description = payload.description;
  if (payload.visibility !== undefined) result.visibility = payload.visibility;
  return result;
}
