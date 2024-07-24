import {
  CmsPageState,
  CmsPost,
} from "@/components/custom/cms/models/cms-post.type.ts"
import { PropsWithChildren, useEffect, useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import { RiFeedbackFill } from "react-icons/ri"
import { LuPartyPopper } from "react-icons/lu"
import { updateCmsPage } from "@/api/cms.ts"
import { Button } from "@/components/ui/button.tsx"

interface CmsFeedbackDialogProps {
  cmsPost: Partial<CmsPost>
  isOpen: boolean
}
export default function CmsFeedbackDialog({
  children,
  cmsPost,
  isOpen,
}: PropsWithChildren<CmsFeedbackDialogProps>) {
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setDialogOpen(isOpen)
  }, [isOpen])

  function onDialogChange(value: boolean): void {
    setDialogOpen(value)

    if (!value && cmsPost.hasAuthorReadFeedback === false && cmsPost.id) {
      // Set hasAuthorReadFeedback to not show the dialog again automatically when entering the editor
      void updateCmsPage(cmsPost.id, { hasAuthorReadFeedback: true })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]" hasCloseButton={true}>
        <DialogHeader>
          <DialogTitle>You have received feedback</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {cmsPost.state === CmsPageState.ChangesRequested && (
            <>
              <RiFeedbackFill className="text-[10rem]" />
              <p className="font-light text-4xl pt-8 text-orange-600">
                Changes have been requested
              </p>
              <p className="text-xl pt-2 text-gray-500">
                Please adapt your article according to the feedback below
              </p>
            </>
          )}
          {cmsPost.state === CmsPageState.Approved && (
            <>
              <LuPartyPopper className="text-[10rem]" />
              <p className="font-light text-4xl pt-8 text-green-600">
                Your post has been approved
              </p>
              <p className="text-xl pt-2 text-gray-500">
                You can now publish your post to be available publicly
              </p>
            </>
          )}
        </div>

        {cmsPost.authorFeedback && (
          <div>
            <p className="text-lg font-medium pb-1">Feedback received:</p>
            <div className="p-8 border rounded-lg">
              <p className="whitespace-break-spaces text-gray-500">
                {cmsPost.authorFeedback}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
