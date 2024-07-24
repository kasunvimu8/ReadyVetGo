import { DELETE, GET, POST, PUT } from "@/lib/http.ts"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"

export const getIsCmsPageAvailable = async (relativeUrl: string) =>
  GET<boolean>(`/cms/available/${relativeUrl}`)

export const getCmsPageById = async (cmsPostId: string) =>
  GET<CmsPost>(`/cms/editor/${cmsPostId}`)

export const getCmsPageByUrl = async (cmsUrl: string) =>
  GET<CmsPost>(`/cms/url/${cmsUrl}`)

export const getAllPublicCmsPages = async (searchQuery?: string) =>
  GET<CmsPost[]>(`/cms/public`, { params: { search: searchQuery } })

export const getOwnCmsPages = async () => GET<CmsPost[]>(`/cms/editor/own`)

export const getCmsPagesInReview = async () =>
  GET<CmsPost[]>(`/cms/editor/in-review`)

export const updateCmsPage = async (id: string, cmsPost: Partial<CmsPost>) =>
  PUT<CmsPost, Partial<CmsPost>>(`/cms/${id}`, cmsPost)

export const createCmsPage = async (cmsPost: Partial<CmsPost>) =>
  POST<CmsPost, Partial<CmsPost>>(`/cms/`, cmsPost)

export const deleteCmsPage = async (cmsPostId: string) =>
  DELETE<{ id: string; message: "deleted" }>(`/cms/${cmsPostId}`)
