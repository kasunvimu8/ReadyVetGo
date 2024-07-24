import { CmsPageState } from "@/components/custom/cms/models/cms-post.type.ts"
import { cn } from "@/lib/utils.ts"

interface CmsStatePillProps {
  state: CmsPageState
}
export function CmsStatePill({ state }: CmsStatePillProps) {
  return (
    <span
      className={cn(
        "uppercase text-sm text-white w-fit px-4 rounded-full py-0.5 whitespace-nowrap",
        {
          "bg-blue-600/80": state === CmsPageState.Draft,
          "bg-lime-600/80": state === CmsPageState.Approved,
          "bg-green-600/80": state === CmsPageState.Published,
          "bg-orange-500/80":
            state === CmsPageState.InReview ||
            state === CmsPageState.ChangesRequested,
        }
      )}
    >
      {state}
    </span>
  )
}
