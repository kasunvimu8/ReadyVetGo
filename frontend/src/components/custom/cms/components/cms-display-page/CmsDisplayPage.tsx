import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { componentFactoryDisplay } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getCmsPageByUrl } from "@/api/cms.ts"
import Loading from "@/components/shared/Loading.tsx"
import { CmsArticleOverview } from "@/components/custom/cms/components/cms-display-page/CmsArticleOverview.tsx"
import {
  CmsPageState,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { IoIosWarning } from "react-icons/io"
import { NotFound } from "@/components/shared/NotFound.tsx"

export default function CmsDisplayPage() {
  const { cmsUrl } = useParams()
  const [cmsPost, setCmsPost] = useState<CmsPost>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchComponents = async () => {
      if (!cmsUrl) return

      try {
        const response = await getCmsPageByUrl(cmsUrl)
        setCmsPost(response)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchComponents()
  }, [cmsUrl])

  const componentPreviewList =
    cmsPost?.cmsComponents.map((component) => (
      <div key={component.id}>
        {componentFactoryDisplay(component.type, {
          content: component.content,
        })}
      </div>
    )) ?? []

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loading className="text-4xl" />
      </div>
    )
  }
  if (!cmsPost) {
    return <NotFound />
  }

  return (
    <ScrollArea>
      <div className="flex justify-center">
        <div className="md:my-8 rounded-lg lg:mx-20 flex flex-col gap-4 w-full max-w-[768px] 2xl:max-w-[1000px] md:shadow-lg">
          {cmsPost && <CmsArticleOverview cmsPost={cmsPost} />}

          {cmsPost?.state !== CmsPageState.Published && (
            <div className="px-8 md:px-20 mb-4">
              <div className="text-orange-900 bg-yellow-200 rounded-xl p-5 flex gap-4 items-center">
                <IoIosWarning className="text-3xl" />
                <p className="text-lg">
                  This page is not public yet, only you can see this page
                </p>
              </div>
            </div>
          )}

          <div className="px-8 md:px-20 pb-20">{componentPreviewList}</div>
        </div>
      </div>
    </ScrollArea>
  )
}
