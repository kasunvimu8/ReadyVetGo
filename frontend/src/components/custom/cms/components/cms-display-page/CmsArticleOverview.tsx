import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"

const fileUploadUrl = import.meta.env.VITE_FILE_UPLOAD_URL

interface CmsArticleOverviewProps {
  cmsPost: Partial<CmsPost>
}
export function CmsArticleOverview({ cmsPost }: CmsArticleOverviewProps) {
  return (
    <div>
      <img
        src={
          cmsPost?.thumbnailUrl
            ? `${fileUploadUrl}/${cmsPost.thumbnailUrl}`
            : "/no-image.jpg"
        }
        alt="Blogpost Picture"
        className="w-full object-cover rounded-lg"
      />
      <h1 className="text-4xl font-bold px-8 md:px-20 pt-4">{cmsPost.title}</h1>
      <p className="text-lg text-gray-500 px-8 md:px-20 pt-2 pb-4">
        Written by {cmsPost.createdBy?.firstName} {cmsPost.createdBy?.lastName}
      </p>
    </div>
  )
}
