import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { componentFactoryDisplay } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import CmsComponentRef from "@/components/custom/cms/models/cms-component-ref.interface.ts"
import { CmsArticleOverview } from "@/components/custom/cms/components/cms-display-page/CmsArticleOverview.tsx"
import { CmsPost } from "@/components/custom/cms/models/cms-post.type.ts"

interface CmsPreviewColumnProps {
  dynamicComponents: CmsComponentRef<unknown>[]
  cmsPost: Partial<CmsPost>
}

export default function CmsPreviewColumn({
  dynamicComponents,
  cmsPost,
}: CmsPreviewColumnProps) {
  const componentPreviewList = dynamicComponents.map((component) => (
    <div key={component.id}>
      {componentFactoryDisplay(component.type, {
        content: component.content,
      })}
    </div>
  ))

  return (
    <ScrollArea className="w-2/3 rounded-md border m-2 relative">
      <div className="mt-8 mx-20 flex flex-col gap-4">
        {cmsPost && <CmsArticleOverview cmsPost={cmsPost} />}

        <div className="px-20 pb-20">{componentPreviewList}</div>
      </div>
    </ScrollArea>
  )
}
