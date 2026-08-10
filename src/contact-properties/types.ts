export type ContactPropertyType = "string" | "number";
export type ContactPropertyFallback = string | number;

export interface ContactProperty {
  object: "contact_property";
  id: string;
  key: string;
  type: ContactPropertyType;
  fallback_value?: ContactPropertyFallback;
  created_at: string;
}

export interface ContactPropertyList {
  object: "list";
  has_more: boolean;
  data: ContactProperty[];
}

export interface ContactPropertyMutationResponse {
  object: "contact_property";
  id: string;
}

export interface ContactPropertyDeleteResponse
  extends ContactPropertyMutationResponse {
  deleted: true;
}

export interface CreateContactPropertyOptions {
  key: string;
  type: ContactPropertyType;
  fallbackValue?: ContactPropertyFallback;
}

export interface UpdateContactPropertyOptions {
  fallbackValue: ContactPropertyFallback | null;
}

export interface ListContactPropertiesOptions {
  limit?: number;
  after?: string;
  before?: string;
}

export interface CreateContactPropertyRequest {
  key: string;
  type: ContactPropertyType;
  fallback_value?: ContactPropertyFallback;
}

export interface UpdateContactPropertyRequest {
  fallback_value: ContactPropertyFallback | null;
}

export function serializeCreateContactProperty(
  payload: CreateContactPropertyOptions,
): CreateContactPropertyRequest {
  const result: CreateContactPropertyRequest = {
    key: payload.key,
    type: payload.type,
  };

  if (payload.fallbackValue !== undefined) {
    result.fallback_value = payload.fallbackValue;
  }

  return result;
}

export function serializeUpdateContactProperty(
  payload: UpdateContactPropertyOptions,
): UpdateContactPropertyRequest {
  return { fallback_value: payload.fallbackValue };
}
