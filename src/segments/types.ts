export interface Segment {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
}

export interface SegmentAudienceSize {
  segment_id: string;
  count: number;
}

export interface SegmentContact {
  id: string;
  team_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  unsubscribed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSegmentOptions {
  name: string;
}

export interface ListSegmentsOptions {
  limit?: number;
  offset?: number;
}

export interface ListSegmentContactsOptions {
  limit?: number;
  offset?: number;
}
