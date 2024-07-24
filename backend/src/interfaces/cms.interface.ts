import { Profile } from "@models/profile.model";

export enum CmsPageState {
  Draft = "draft",
  InReview = "in-review",
  Approved = "approved",
  ChangesRequested = "changes-requested",
  Published = "published",
}

export enum CmsPageType {
  Medical = "medical",
  Info = "info",
}

export interface CmsComponent<T> {
  id: string;
  type: string;
  content: T;
}

export type CmsPage = {
  id: string;
  title: string;
  createdBy: string | Partial<Profile>;
  authorFeedback?: string;
  hasAuthorReadFeedback?: boolean;
  relativeUrl: string;
  thumbnailUrl?: string;
  postedDate?: Date;
  lastEditedDate?: Date;
  state: CmsPageState;
  type: CmsPageType;
  cmsComponents: CmsComponent<unknown>[];
};
