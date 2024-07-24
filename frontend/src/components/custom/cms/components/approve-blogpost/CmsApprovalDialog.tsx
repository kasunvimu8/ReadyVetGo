import {
  CmsPageState,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { PropsWithChildren, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { componentFactoryDisplay } from "@/components/custom/cms/utils/cms-component-factory.tsx"
import { CmsArticleOverview } from "@/components/custom/cms/components/cms-display-page/CmsArticleOverview.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Button } from "@/components/ui/button.tsx"
import { FaCheck } from "react-icons/fa"
import { RiFeedbackFill } from "react-icons/ri"
import { Label } from "@/components/ui/label.tsx"

interface CmsApprovalDialogProps {
  cmsPost: CmsPost
  onSubmitDialog: (newState: CmsPageState, feedback?: string) => Promise<void>
}
export default function CmsApprovalDialog({
  children,
  cmsPost,
  onSubmitDialog,
}: PropsWithChildren<CmsApprovalDialogProps>) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")

  const componentPreviewList = cmsPost.cmsComponents.map((component) => (
    <div key={component.id}>
      {componentFactoryDisplay(component.type, {
        content: component.content,
      })}
    </div>
  ))

  const onAskForChanges = () => {
    void onSubmitDialog(CmsPageState.ChangesRequested, feedbackText).then(() =>
      setDialogOpen(false)
    )
  }

  const onApprove = () => {
    onSubmitDialog(CmsPageState.Approved, feedbackText).then(() =>
      setDialogOpen(false)
    )
  }

  function onDialogChange(value: boolean): void {
    setDialogOpen(value)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[1000px] max-h-[90vh] overflow-y-hidden h-full"
        hasCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Blog Post Review</DialogTitle>
        </DialogHeader>
        <div className="grid w-full overflow-y-hidden">
          <ScrollArea className="relative">
            <div className="mt-8 mx-20 flex flex-col gap-4">
              {cmsPost && <CmsArticleOverview cmsPost={cmsPost} />}

              <div className="px-20 pb-20">{componentPreviewList}</div>
            </div>
          </ScrollArea>

          <div className="rounded-xl border p-4 shadow">
            <Label htmlFor="feedback" className="text-xl mb-1 block">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              onChange={(e) => setFeedbackText(e.target.value)}
              className="h-[150px] text-lg resize-none"
              placeholder="Write feedback about that article"
            ></Textarea>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => {}}>
                Close
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700"
              onClick={onAskForChanges}
            >
              <RiFeedbackFill className="mr-2" />
              Ask for changes
            </Button>

            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800"
              onClick={onApprove}
            >
              <FaCheck className="mr-2" /> Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
