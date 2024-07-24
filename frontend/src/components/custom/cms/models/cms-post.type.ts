import CmsComponentRef from "@/components/custom/cms/models/cms-component-ref.interface.ts"

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

export type CmsPost = {
  id: string
  title: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl?: string
  }
  authorFeedback?: string
  hasAuthorReadFeedback?: boolean
  relativeUrl: string
  thumbnailUrl?: string
  postedDate?: Date
  lastEditedDate?: Date
  state: CmsPageState
  type: CmsPageType
  cmsComponents: CmsComponentRef<unknown>[]
}
